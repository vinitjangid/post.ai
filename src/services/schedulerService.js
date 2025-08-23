const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');
const { getRandomTip } = require('../utils/helpers');
const PostModel = require('../models/PostModel');
const MCQModel = require('../models/MCQModel');
const LinkedInMCQService = require('./linkedinMCQService');

class SchedulerService {
    constructor(linkedinService, config) {
        this.linkedinService = linkedinService;
        this.config = config;
        this.mcqService = new LinkedInMCQService(config);
        
        this.jsTips = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../data/javascriptTips.json'), 'utf8')
        );
        this.reactTips = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../data/reactTips.json'), 'utf8')
        );
        this.postedTips = new Set();
        
        // Initialize MCQ model
        this.mcqModel = new MCQModel();
        
        // Load any previously posted tips
        const posts = PostModel.getAllPosts();
        posts.forEach(post => {
            if (post.status === 'published') {
                const tipContent = this.extractTipContent(post.content);
                if (tipContent) this.postedTips.add(tipContent);
            }
        });
    }
    
    // Extract the actual tip from the formatted post content
    extractTipContent(formattedContent) {
        // The tip is between the header and hashtags
        const lines = formattedContent.split('\n\n');
        if (lines.length >= 2) {
            return lines[1]; // The actual tip is usually the second section
        }
        return null;
    }

    scheduleDailyPosts() {
        logger.info('Starting scheduler for daily LinkedIn posts');
        
        // Schedule regular tips at 9:00 AM every day
        cron.schedule('0 9 * * *', () => {
            logger.info('Running scheduled job to post tip');
            this.postDailyTip();
        });
        
        // Schedule MCQs at 3:00 PM on Monday, Wednesday, Friday
        cron.schedule('0 15 * * 1,3,5', () => {
            logger.info('Running scheduled job to post MCQ');
            this.postDailyMCQ();
        });
        
        // Schedule MCQ answers at 3:00 PM the day after posting the question (Tuesday, Thursday, Saturday)
        cron.schedule('0 15 * * 2,4,6', () => {
            logger.info('Running scheduled job to post MCQ answer');
            this.postMCQAnswer();
        });
        
        // Also post immediately when starting the app (optional)
        // Uncomment if you want an immediate post on startup
        // this.postDailyTip();
    }

    postDailyTip() {
        try {
            // Alternate between JavaScript and React tips
            const tipSource = new Date().getDate() % 2 === 0 ? this.jsTips : this.reactTips;
            const category = new Date().getDate() % 2 === 0 ? 'javascript' : 'react';
            const tipType = category === 'javascript' ? 'JavaScript' : 'React';
            
            // Get a random tip that hasn't been posted yet
            const tip = getRandomTip(tipSource, this.postedTips);
            
            // Format the tip with hashtags
            const formattedTip = `💻 Daily ${tipType} Tip 💻\n\n${tip}\n\n#${tipType.toLowerCase()} #programming #webdevelopment #coding #dailytips`;
            
            // Create a record in the post history first
            const post = PostModel.addPost({
                type: 'tip',
                category,
                content: formattedTip,
                date: new Date().toISOString(),
                status: 'pending'
            });
            
            // Post to LinkedIn
            this.linkedinService.postTip(formattedTip)
                .then(() => {
                    logger.info(`Successfully posted ${tipType} tip`);
                    this.postedTips.add(tip);
                    
                    // Update the post status in our database
                    PostModel.updatePost(post.id, { status: 'published' });
                })
                .catch(error => {
                    logger.error('Failed to post tip', error);
                    
                    // Update the post status in our database
                    PostModel.updatePost(post.id, { status: 'failed' });
                });
        } catch (error) {
            logger.error('Error in postDailyTip', error);
        }
    }
    
    postDailyMCQ() {
        try {
            // Get unposted MCQs
            const unpostedMCQs = this.mcqModel.getUnpostedMCQs();
            
            if (unpostedMCQs.length === 0) {
                logger.warn('No unposted MCQs available');
                return;
            }
            
            // Choose one MCQ randomly
            const mcq = unpostedMCQs[Math.floor(Math.random() * unpostedMCQs.length)];
            
            // Create a record in the post history first
            const post = this.mcqModel.addPostedMCQ(mcq);
            
            // Post to LinkedIn
            this.mcqService.postMCQ(mcq)
                .then((response) => {
                    if (response.success) {
                        logger.info(`Successfully posted MCQ #${mcq.id}`);
                        
                        // Store the LinkedIn post ID for later answering
                        const posts = JSON.parse(fs.readFileSync(this.mcqModel.postsFilePath, 'utf-8'));
                        const mcqPost = posts.find(p => p.id === post.id);
                        if (mcqPost) {
                            mcqPost.linkedinPostId = response.postId;
                            mcqPost.status = 'published';
                            fs.writeFileSync(this.mcqModel.postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
                        }
                    } else {
                        logger.error(`Failed to post MCQ #${mcq.id} to LinkedIn:`, response.error);
                        
                        // Update post status to failed
                        const posts = JSON.parse(fs.readFileSync(this.mcqModel.postsFilePath, 'utf-8'));
                        const mcqPost = posts.find(p => p.id === post.id);
                        if (mcqPost) {
                            mcqPost.status = 'failed';
                            fs.writeFileSync(this.mcqModel.postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
                        }
                    }
                })
                .catch(error => {
                    logger.error(`Error posting MCQ #${mcq.id}:`, error);
                });
        } catch (error) {
            logger.error('Error in postDailyMCQ', error);
        }
    }
    
    postMCQAnswer() {
        try {
            // Get all posts
            const posts = JSON.parse(fs.readFileSync(this.mcqModel.postsFilePath, 'utf-8'));
            
            // Find the most recent MCQ post with a LinkedIn post ID that hasn't had its answer posted
            const mcqPostsWithIds = posts
                .filter(post => post.type === 'mcq' && post.linkedinPostId && !post.answerPosted)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            
            if (mcqPostsWithIds.length === 0) {
                logger.info('No MCQ posts found needing answers');
                return;
            }
            
            const mcqPost = mcqPostsWithIds[0];
            
            // Get the full MCQ from the MCQs list
            const allMCQs = this.mcqModel.getAllMCQs();
            const mcq = allMCQs.find(m => m.id === mcqPost.contentId);
            
            if (!mcq) {
                logger.error(`MCQ with ID ${mcqPost.contentId} not found`);
                return;
            }
            
            // Post the answer as a comment
            this.mcqService.postMCQAnswer(mcq, mcqPost.linkedinPostId)
                .then((response) => {
                    if (response.success) {
                        logger.info(`Successfully posted answer for MCQ #${mcq.id}`);
                        
                        // Mark this MCQ as having its answer posted
                        const updatedPosts = JSON.parse(fs.readFileSync(this.mcqModel.postsFilePath, 'utf-8'));
                        const postToUpdate = updatedPosts.find(p => p.id === mcqPost.id);
                        if (postToUpdate) {
                            postToUpdate.answerPosted = true;
                            postToUpdate.answerDate = new Date().toISOString();
                            fs.writeFileSync(this.mcqModel.postsFilePath, JSON.stringify(updatedPosts, null, 2), 'utf-8');
                        }
                    } else {
                        logger.error(`Failed to post answer for MCQ #${mcq.id}:`, response.error);
                    }
                })
                .catch(error => {
                    logger.error(`Error posting answer for MCQ #${mcq.id}:`, error);
                });
        } catch (error) {
            logger.error('Error in postMCQAnswer', error);
        }
    }
    
    getStats() {
        const mcqStats = {
            totalMCQs: this.mcqModel.getAllMCQs().length,
            postedMCQs: this.mcqModel.getPostedMCQs().length,
            unpostedMCQs: this.mcqModel.getUnpostedMCQs().length,
        };
        
        return {
            postedTipsCount: this.postedTips.size,
            jsTipsTotal: this.jsTips.length,
            reactTipsTotal: this.reactTips.length,
            remainingJSTips: this.jsTips.length - this.postedTips.size,
            remainingReactTips: this.reactTips.length - this.postedTips.size,
            mcq: mcqStats
        };
    }
}

module.exports = SchedulerService;
