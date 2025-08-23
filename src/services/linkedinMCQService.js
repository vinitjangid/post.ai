/**
 * LinkedIn Service for posting MCQs
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { logger } = require('../utils/logger');

class LinkedInMCQService {
    constructor(config) {
        this.config = config;
        this.apiClient = axios.create({
            baseURL: 'https://api.linkedin.com/v2',
            headers: {
                'Authorization': `Bearer ${config.accessToken}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });
    }

    /**
     * Format MCQ for posting on LinkedIn
     * @param {Object} mcq - The MCQ question object
     * @returns {String} - Formatted MCQ text for LinkedIn
     */
    formatMCQForPost(mcq) {
        // Add hashtags based on category
        const hashtags = mcq.category === 'javascript' 
            ? '#JavaScript #WebDevelopment #CodingQuiz'
            : '#React #Frontend #CodingQuiz';

        // Format options
        const optionsText = mcq.options.map((opt, i) => 
            `${String.fromCharCode(65 + i)}) ${opt}`
        ).join('\n');
        
        // Craft the post text
        return `🧠 #DailyCodingQuiz:\n\n${mcq.question}\n\n${optionsText}\n\n${hashtags}\n\nAnswer will be posted in the comments in 24 hours! Share your answer below.`;
    }

    /**
     * Format the answer to a previously posted MCQ
     * @param {Object} mcq - The MCQ question object
     * @returns {String} - Formatted answer text for LinkedIn
     */
    formatMCQAnswer(mcq) {
        return `🎯 Answer to yesterday's coding quiz:\n\nThe correct answer is ${mcq.correctAnswer}\n\n${mcq.explanation}\n\n#CodingExplained #LearnToCode`;
    }

    /**
     * Post an MCQ to LinkedIn
     * @param {Object} mcq - The MCQ to post
     * @returns {Object} - LinkedIn API response
     */
    async postMCQ(mcq) {
        try {
            const postText = this.formatMCQForPost(mcq);
            logger.info(`Posting MCQ to LinkedIn: ${mcq.id}`);
            
            const response = await this.apiClient.post('/ugcPosts', {
                author: `urn:li:person:${this.config.personId}`,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: postText
                        },
                        shareMediaCategory: 'NONE'
                    }
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            });
            
            logger.info(`Successfully posted MCQ ${mcq.id} to LinkedIn`);
            return {
                success: true,
                data: response.data,
                postId: response.data.id
            };
        } catch (error) {
            logger.error(`Error posting MCQ ${mcq.id} to LinkedIn:`, error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Post an MCQ answer as a comment on a previous post
     * @param {Object} mcq - The MCQ containing the answer
     * @param {String} postId - The LinkedIn post ID to comment on
     * @returns {Object} - LinkedIn API response
     */
    async postMCQAnswer(mcq, postId) {
        try {
            const answerText = this.formatMCQAnswer(mcq);
            logger.info(`Posting MCQ answer for question ${mcq.id}`);
            
            // Use the LinkedIn Comments API to post the answer as a comment
            const commentResponse = await this.apiClient.post(`/socialActions/${postId}/comments`, {
                actor: `urn:li:person:${this.config.personId}`,
                message: {
                    text: answerText
                }
            });
            
            logger.info(`Successfully posted answer for MCQ ${mcq.id}`);
            return {
                success: true,
                data: commentResponse.data,
                commentId: commentResponse.data.id
            };
        } catch (error) {
            logger.error(`Error posting answer for MCQ ${mcq.id}:`, error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Post an MCQ with an image to LinkedIn
     * @param {Object} mcq - The MCQ to post
     * @param {String} imagePath - Path to the image file
     * @returns {Object} - LinkedIn API response
     */
    async postMCQWithImage(mcq, imagePath) {
        try {
            const postText = this.formatMCQForPost(mcq);
            
            // Step 1: Register the image upload
            const registerResponse = await this.apiClient.post('/assets?action=registerUpload', {
                registerUploadRequest: {
                    recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                    owner: `urn:li:person:${this.config.personId}`,
                    serviceRelationships: [
                        {
                            relationshipType: 'OWNER',
                            identifier: 'urn:li:userGeneratedContent'
                        }
                    ]
                }
            });
            
            const uploadUrl = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
            const assetId = registerResponse.data.value.asset;
            
            // Step 2: Upload the image
            const imageData = fs.readFileSync(imagePath);
            await axios.put(uploadUrl, imageData, {
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            });
            
            // Step 3: Create the post with the image
            const response = await this.apiClient.post('/ugcPosts', {
                author: `urn:li:person:${this.config.personId}`,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: postText
                        },
                        shareMediaCategory: 'IMAGE',
                        media: [
                            {
                                status: 'READY',
                                description: {
                                    text: `MCQ Question #${mcq.id}`
                                },
                                media: assetId
                            }
                        ]
                    }
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            });
            
            logger.info(`Successfully posted MCQ ${mcq.id} with image to LinkedIn`);
            return {
                success: true,
                data: response.data,
                postId: response.data.id
            };
        } catch (error) {
            logger.error(`Error posting MCQ ${mcq.id} with image:`, error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = LinkedInMCQService;
