const { MongoClient } = require('mongodb');
const { logger } = require('../utils/logger');

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/linkedin-js-tips';
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const dbName = new URL(uri).pathname.substr(1);
  const db = client.db(dbName);
  cachedDb = db;
  return db;
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const path = event.path.replace('/.netlify/functions/api', '');
    const segments = path.split('/').filter(Boolean);
    const method = event.httpMethod;
    
    // Handle different API routes
    if (segments.length === 1 && segments[0] === 'posts') {
      if (method === 'GET') {
        return await getPosts();
      } else if (method === 'POST' && event.body) {
        return await createPost(JSON.parse(event.body));
      }
    } else if (segments.length === 2 && segments[0] === 'posts') {
      const postId = segments[1];
      if (method === 'GET') {
        return await getPostById(postId);
      } else if (method === 'PUT' && event.body) {
        return await updatePost(postId, JSON.parse(event.body));
      } else if (method === 'DELETE') {
        return await deletePost(postId);
      }
    } else if (segments.length === 1 && segments[0] === 'mcq') {
      if (method === 'GET') {
        return await getMCQs();
      }
    } else if (segments.length === 1 && segments[0] === 'health') {
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          status: 'healthy',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development'
        })
      };
    }
    
    // If no route matches
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Not Found' }),
    };
  } catch (error) {
    logger.error('API function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

// Helper functions to interact with MongoDB
async function getPosts() {
  try {
    const db = await connectToDatabase();
    const posts = await db.collection('posts').find({}).sort({ date: -1 }).toArray();
    
    return {
      statusCode: 200,
      body: JSON.stringify(posts),
    };
  } catch (error) {
    logger.error('Error getting posts:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error retrieving posts' }),
    };
  }
}

async function getPostById(id) {
  try {
    const db = await connectToDatabase();
    const post = await db.collection('posts').findOne({ id });
    
    if (!post) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Post not found' }),
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(post),
    };
  } catch (error) {
    logger.error(`Error getting post ${id}:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error retrieving post' }),
    };
  }
}

async function createPost(data) {
  try {
    const db = await connectToDatabase();
    const post = {
      ...data,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    await db.collection('posts').insertOne(post);
    
    return {
      statusCode: 201,
      body: JSON.stringify(post),
    };
  } catch (error) {
    logger.error('Error creating post:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error creating post' }),
    };
  }
}

async function updatePost(id, data) {
  try {
    const db = await connectToDatabase();
    const result = await db.collection('posts').updateOne(
      { id },
      { $set: { ...data, updatedAt: new Date().toISOString() } }
    );
    
    if (result.matchedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Post not found' }),
      };
    }
    
    const updatedPost = await db.collection('posts').findOne({ id });
    
    return {
      statusCode: 200,
      body: JSON.stringify(updatedPost),
    };
  } catch (error) {
    logger.error(`Error updating post ${id}:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating post' }),
    };
  }
}

async function deletePost(id) {
  try {
    const db = await connectToDatabase();
    const result = await db.collection('posts').deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Post not found' }),
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Post deleted successfully' }),
    };
  } catch (error) {
    logger.error(`Error deleting post ${id}:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error deleting post' }),
    };
  }
}

async function getMCQs() {
  try {
    const db = await connectToDatabase();
    const mcqs = await db.collection('mcqs').find({}).toArray();
    
    return {
      statusCode: 200,
      body: JSON.stringify(mcqs),
    };
  } catch (error) {
    logger.error('Error getting MCQs:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error retrieving MCQs' }),
    };
  }
}
