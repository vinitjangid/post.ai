import javascriptTips from '../data/javascriptTips.json';
import reactTips from '../data/reactTips.json';
import mcqQuestions from '../data/mcqQuestions.json';

// Local storage keys
const POSTS_STORAGE_KEY = 'linkedin_posts_history';

// Helper function to get stored posts
const getStoredPosts = () => {
  const posts = localStorage.getItem(POSTS_STORAGE_KEY);
  return posts ? JSON.parse(posts) : [];
};

// Helper function to store posts
const storePosts = (posts) => {
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
};

export const getPostHistory = async () => {
  try {
    // Get posts from local storage instead of API
    return getStoredPosts();
  } catch (error) {
    console.error('Error fetching post history:', error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    // Generate a unique ID for the post
    const newPost = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'posted' // Simulating successful post
    };
    
    // In a real implementation, you would make the LinkedIn API call here
    // For now, we'll just store it in local storage
    const posts = getStoredPosts();
    posts.push(newPost);
    storePosts(posts);
    
    return newPost;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const uploadPostImage = async (formData) => {
  try {
    // In a real implementation, you'd upload to LinkedIn API or a storage service
    // For now, we'll just return a simulated URL for the uploaded image
    const file = formData.get('image');
    
    // Create a data URL for the image
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ imageUrl: reader.result });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const getStats = async () => {
  try {
    // Calculate stats from local storage instead of backend API
    const posts = getStoredPosts();
    
    // Sample stats calculation
    const totalPosts = posts.length;
    const postsByType = posts.reduce((acc, post) => {
      acc[post.postType] = (acc[post.postType] || 0) + 1;
      return acc;
    }, {});
    
    const postsByCategory = posts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalPosts,
      postsByType,
      postsByCategory,
      recentPosts: posts.slice(-5)
    };
  } catch (error) {
    console.error('Error calculating stats:', error);
    throw error;
  }
};

export const getMCQs = async () => {
  try {
    // Return MCQs from local data
    return mcqQuestions;
  } catch (error) {
    console.error('Error fetching MCQs:', error);
    throw error;
  }
};

export const getTips = async (category = 'javascript') => {
  try {
    // Return tips from local data
    return category === 'javascript' ? javascriptTips : reactTips;
  } catch (error) {
    console.error('Error fetching tips:', error);
    throw error;
  }
};

// Function to get a random JavaScript tip
export const fetchJavaScriptTip = async () => {
  try {
    // Get a random JavaScript tip
    const tips = javascriptTips;
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  } catch (error) {
    console.error('Error fetching JavaScript tip:', error);
    throw error;
  }
};

// Function to get a random React tip
export const fetchReactTip = async () => {
  try {
    // Get a random React tip
    const tips = reactTips;
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  } catch (error) {
    console.error('Error fetching React tip:', error);
    throw error;
  }
};
