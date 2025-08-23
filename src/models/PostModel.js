const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');

class Post {
    constructor(id, type, category, content, date, status, imageUrl = null) {
        this.id = id;
        this.type = type; // 'tip', 'image', 'custom'
        this.category = category; // 'javascript', 'react'
        this.content = content;
        this.date = date;
        this.status = status; // 'published', 'failed', 'pending'
        this.imageUrl = imageUrl;
    }
}

class PostModel {
    constructor() {
        this.posts = [];
        this.dataFile = path.join(__dirname, '../data/posts.json');
        this.loadPosts();
    }

    loadPosts() {
        try {
            // Check if the file exists
            if (fs.existsSync(this.dataFile)) {
                const data = fs.readFileSync(this.dataFile, 'utf8');
                this.posts = JSON.parse(data);
                logger.info(`Loaded ${this.posts.length} posts from database`);
            } else {
                // Create the file with an empty array
                this.posts = [];
                this.savePosts();
                logger.info('Created new posts database');
            }
        } catch (error) {
            logger.error('Error loading posts:', error);
            this.posts = [];
        }
    }

    savePosts() {
        try {
            const dir = path.dirname(this.dataFile);
            
            // Create the directory if it doesn't exist
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(this.dataFile, JSON.stringify(this.posts, null, 2));
            logger.info(`Saved ${this.posts.length} posts to database`);
        } catch (error) {
            logger.error('Error saving posts:', error);
        }
    }

    getAllPosts() {
        return [...this.posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    getPostById(id) {
        return this.posts.find(post => post.id === id);
    }

    addPost(post) {
        // Generate a unique ID
        const id = Date.now().toString();
        
        const newPost = new Post(
            id,
            post.type,
            post.category,
            post.content,
            post.date || new Date().toISOString(),
            post.status || 'pending',
            post.imageUrl
        );
        
        this.posts.push(newPost);
        this.savePosts();
        return newPost;
    }

    updatePost(id, updates) {
        const index = this.posts.findIndex(post => post.id === id);
        
        if (index !== -1) {
            this.posts[index] = { ...this.posts[index], ...updates };
            this.savePosts();
            return this.posts[index];
        }
        
        return null;
    }

    deletePost(id) {
        const initialLength = this.posts.length;
        this.posts = this.posts.filter(post => post.id !== id);
        
        if (this.posts.length !== initialLength) {
            this.savePosts();
            return true;
        }
        
        return false;
    }

    getStats() {
        const totalPosts = this.posts.length;
        const publishedPosts = this.posts.filter(post => post.status === 'published').length;
        const javascriptPosts = this.posts.filter(post => post.category === 'javascript').length;
        const reactPosts = this.posts.filter(post => post.category === 'react').length;
        
        // Posts by month (last 6 months)
        const postsByMonth = {};
        const now = new Date();
        
        for (let i = 0; i < 6; i++) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            const monthKey = date.toISOString().substring(0, 7); // YYYY-MM format
            postsByMonth[monthKey] = 0;
        }
        
        // Count posts for each month
        this.posts.forEach(post => {
            const monthKey = post.date.substring(0, 7);
            if (postsByMonth[monthKey] !== undefined) {
                postsByMonth[monthKey]++;
            }
        });
        
        return {
            totalPosts,
            publishedPosts,
            javascriptPosts,
            reactPosts,
            postsByMonth
        };
    }
}

module.exports = new PostModel();
