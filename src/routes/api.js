const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PostModel = require('../models/PostModel');
const MCQModel = require('../models/MCQModel');
const { logger } = require('../utils/logger');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + extension);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all posts
router.get('/posts', (req, res) => {
  try {
    const posts = PostModel.getAllPosts();
    res.json(posts);
  } catch (error) {
    logger.error('Error retrieving posts:', error);
    res.status(500).json({ message: 'Failed to retrieve posts' });
  }
});

// Get post by ID
router.get('/posts/:id', (req, res) => {
  try {
    const post = PostModel.getPostById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    logger.error('Error retrieving post:', error);
    res.status(500).json({ message: 'Failed to retrieve post' });
  }
});

// Create a new post
router.post('/posts', async (req, res) => {
  try {
    const { type, category, content, imageUrl } = req.body;
    
    if (!type || !category || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newPost = PostModel.addPost({
      type,
      category,
      content,
      imageUrl,
      date: new Date().toISOString(),
      status: 'pending'
    });
    
    // Post to LinkedIn if global service is available
    if (global.linkedinService) {
      try {
        // Format post content
        let formattedContent = content;
        
        // If it's a tip, add formatting
        if (type === 'tip') {
          formattedContent = `💻 Daily ${category === 'javascript' ? 'JavaScript' : 'React'} Tip 💻\n\n${content}\n\n#${category} #programming #webdevelopment #coding #dailytips`;
        }
        
        // Post to LinkedIn
        if (imageUrl) {
          // If we have image functionality in the LinkedIn service
          await global.linkedinService.postWithImage(formattedContent, imageUrl);
        } else {
          await global.linkedinService.postTip(formattedContent);
        }
        
        // Update post status to published
        PostModel.updatePost(newPost.id, { status: 'published' });
        newPost.status = 'published';
      } catch (error) {
        logger.error('Failed to post to LinkedIn:', error);
        PostModel.updatePost(newPost.id, { status: 'failed' });
        newPost.status = 'failed';
      }
    }
    
    res.status(201).json(newPost);
  } catch (error) {
    logger.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// Upload image
router.post('/posts/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    // Generate URL for the uploaded image
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.status(201).json({ imageUrl });
  } catch (error) {
    logger.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

// Get stats
router.get('/stats', (req, res) => {
  try {
    const stats = PostModel.getStats();
    res.json(stats);
  } catch (error) {
    logger.error('Error retrieving stats:', error);
    res.status(500).json({ message: 'Failed to retrieve stats' });
  }
});

// MCQ Routes
// Get all MCQs
router.get('/mcq', (req, res) => {
  try {
    const mcqModel = new MCQModel();
    const mcqs = mcqModel.getAllMCQs();
    res.json(mcqs);
  } catch (error) {
    logger.error('Error retrieving MCQs:', error);
    res.status(500).json({ message: 'Failed to retrieve MCQs' });
  }
});

// Get MCQs by category
router.get('/mcq/category/:category', (req, res) => {
  try {
    const mcqModel = new MCQModel();
    const mcqs = mcqModel.getMCQsByCategory(req.params.category);
    res.json(mcqs);
  } catch (error) {
    logger.error(`Error retrieving ${req.params.category} MCQs:`, error);
    res.status(500).json({ message: `Failed to retrieve ${req.params.category} MCQs` });
  }
});

// Get posted MCQs
router.get('/mcq/posted', (req, res) => {
  try {
    const mcqModel = new MCQModel();
    const mcqs = mcqModel.getPostedMCQs();
    res.json(mcqs);
  } catch (error) {
    logger.error('Error retrieving posted MCQs:', error);
    res.status(500).json({ message: 'Failed to retrieve posted MCQs' });
  }
});

// Get unposted MCQs
router.get('/mcq/unposted', (req, res) => {
  try {
    const mcqModel = new MCQModel();
    const mcqs = mcqModel.getUnpostedMCQs();
    res.json(mcqs);
  } catch (error) {
    logger.error('Error retrieving unposted MCQs:', error);
    res.status(500).json({ message: 'Failed to retrieve unposted MCQs' });
  }
});

// Post a new MCQ
router.post('/mcq/:id', (req, res) => {
  try {
    const mcqModel = new MCQModel();
    const mcqId = parseInt(req.params.id);
    const allMCQs = mcqModel.getAllMCQs();
    const mcqToPost = allMCQs.find(mcq => mcq.id === mcqId);
    
    if (!mcqToPost) {
      return res.status(404).json({ message: `MCQ with id ${mcqId} not found` });
    }
    
    const postedMCQ = mcqModel.addPostedMCQ(mcqToPost);
    res.status(201).json(postedMCQ);
  } catch (error) {
    logger.error('Error posting MCQ:', error);
    res.status(500).json({ message: 'Failed to post MCQ' });
  }
});

// Delete a posted MCQ
router.delete('/mcq/:id', (req, res) => {
  try {
    const mcqModel = new MCQModel();
    const result = mcqModel.deletePostedMCQ(req.params.id);
    res.json(result);
  } catch (error) {
    logger.error('Error deleting MCQ post:', error);
    res.status(500).json({ message: 'Failed to delete MCQ post' });
  }
});

module.exports = router;
