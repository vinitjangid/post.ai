const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { logger } = require('../utils/logger');

class LinkedInService {
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
        
        // Track posted tips to avoid duplicates
        this.postedTips = new Set();
    }

    async postTip(tip) {
        try {
            logger.info(`Posting tip to LinkedIn: ${tip.substring(0, 30)}...`);
            const response = await this.apiClient.post('/ugcPosts', {
                author: `urn:li:person:${this.config.personId}`,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: tip
                        },
                        shareMediaCategory: 'NONE'
                    }
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            });
            logger.info('Successfully posted tip to LinkedIn');
            
            // Add to posted tips set
            this.postedTips.add(tip);
            
            return response.data;
        } catch (error) {
            logger.error('Error posting tip to LinkedIn:', error);
            throw error;
        }
    }
    
    async postWithImage(text, imageUrl) {
        try {
            logger.info(`Posting image with text to LinkedIn: ${text.substring(0, 30)}...`);
            
            // Step 1: Register the image upload
            const registerUploadResponse = await this.apiClient.post('/assets?action=registerUpload', {
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
            
            // Get upload URL and asset URN from response
            const uploadUrl = registerUploadResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
            const assetUrn = registerUploadResponse.data.value.asset;
            
            // Step 2: Upload the image to the provided URL
            // First, we need to get the image data from our server
            const imagePath = path.join(__dirname, '..', imageUrl);
            const imageBuffer = fs.readFileSync(imagePath);
            
            // Upload the image
            await axios.put(uploadUrl, imageBuffer, {
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            });
            
            // Step 3: Create a post with the uploaded image
            const postResponse = await this.apiClient.post('/ugcPosts', {
                author: `urn:li:person:${this.config.personId}`,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: text
                        },
                        shareMediaCategory: 'IMAGE',
                        media: [
                            {
                                status: 'READY',
                                description: {
                                    text: 'JavaScript/React tip image'
                                },
                                media: assetUrn
                            }
                        ]
                    }
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            });
            
            logger.info('Successfully posted image to LinkedIn');
            return postResponse.data;
        } catch (error) {
            logger.error('Error posting image to LinkedIn:', error);
            throw error;
        }
    }
    
    getPostedCount() {
        return this.postedTips.size;
    }
}

module.exports = LinkedInService;