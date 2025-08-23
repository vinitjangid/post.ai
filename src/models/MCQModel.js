const fs = require('fs');
const path = require('path');

class MCQModel {
  constructor() {
    this.mcqsFilePath = path.join(__dirname, '../data/mcqQuestions.js');
    this.postsFilePath = path.join(__dirname, '../data/posts.json');
  }

  // Get all MCQs
  getAllMCQs() {
    try {
      // Import the MCQs (they are in a module)
      const mcqQuestions = require(this.mcqsFilePath);
      return mcqQuestions;
    } catch (error) {
      console.error('Error getting MCQs:', error);
      return [];
    }
  }

  // Get MCQs by category
  getMCQsByCategory(category) {
    try {
      const mcqQuestions = this.getAllMCQs();
      return mcqQuestions.filter(mcq => mcq.category === category);
    } catch (error) {
      console.error(`Error getting ${category} MCQs:`, error);
      return [];
    }
  }

  // Get posted MCQs
  getPostedMCQs() {
    try {
      let posts = [];
      if (fs.existsSync(this.postsFilePath)) {
        const postsData = fs.readFileSync(this.postsFilePath, 'utf-8');
        posts = JSON.parse(postsData);
      }
      
      // Filter posts to get only MCQs
      return posts.filter(post => post.type === 'mcq');
    } catch (error) {
      console.error('Error getting posted MCQs:', error);
      return [];
    }
  }
  
  // Get MCQs that haven't been posted
  getUnpostedMCQs() {
    try {
      const allMCQs = this.getAllMCQs();
      const postedMCQs = this.getPostedMCQs();
      
      // Get array of posted MCQ IDs
      const postedMCQIds = postedMCQs.map(post => post.contentId);
      
      // Return MCQs that haven't been posted
      return allMCQs.filter(mcq => !postedMCQIds.includes(mcq.id));
    } catch (error) {
      console.error('Error getting unposted MCQs:', error);
      return [];
    }
  }

  // Add a post record for an MCQ
  addPostedMCQ(mcq) {
    try {
      let posts = [];
      if (fs.existsSync(this.postsFilePath)) {
        const postsData = fs.readFileSync(this.postsFilePath, 'utf-8');
        posts = JSON.parse(postsData);
      }
      
      // Create a new post record
      const newPost = {
        id: posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1,
        contentId: mcq.id,
        type: 'mcq',
        content: `${mcq.question}\n\nOptions:\n${mcq.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}`,
        answer: mcq.correctAnswer,
        explanation: mcq.explanation,
        category: mcq.category,
        difficulty: mcq.difficulty,
        date: new Date().toISOString()
      };
      
      posts.push(newPost);
      fs.writeFileSync(this.postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
      return newPost;
    } catch (error) {
      console.error('Error adding posted MCQ:', error);
      throw error;
    }
  }
  
  // Delete a posted MCQ
  deletePostedMCQ(postId) {
    try {
      if (!fs.existsSync(this.postsFilePath)) {
        throw new Error('Posts file does not exist');
      }
      
      const postsData = fs.readFileSync(this.postsFilePath, 'utf-8');
      let posts = JSON.parse(postsData);
      
      // Find the post by ID
      const postIndex = posts.findIndex(post => post.id === parseInt(postId));
      if (postIndex === -1) {
        throw new Error(`Post with ID ${postId} not found`);
      }
      
      // Remove the post
      posts.splice(postIndex, 1);
      fs.writeFileSync(this.postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
      
      return { success: true, message: `Post ${postId} has been deleted` };
    } catch (error) {
      console.error('Error deleting posted MCQ:', error);
      throw error;
    }
  }
}

module.exports = MCQModel;
