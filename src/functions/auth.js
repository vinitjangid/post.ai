const axios = require('axios');
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
    const path = event.path.replace('/.netlify/functions/auth', '');
    const segments = path.split('/').filter(Boolean);
    
    // Handle LinkedIn OAuth endpoints
    if (segments.length === 0 || segments[0] === 'linkedin') {
      return handleLinkedInAuth(event);
    } else if (segments.length === 1 && segments[0] === 'callback') {
      return handleLinkedInCallback(event);
    } else if (segments.length === 1 && segments[0] === 'status') {
      return getLinkedInStatus();
    }
    
    // If no route matches
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Not Found' }),
    };
  } catch (error) {
    logger.error('Auth function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

// Handle LinkedIn authorization request
async function handleLinkedInAuth() {
  const clientId = process.env.LINKEDIN_API_KEY;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI || 
                     'https://your-netlify-site.netlify.app/.netlify/functions/auth/callback';
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state in database for CSRF protection
  const db = await connectToDatabase();
  await db.collection('oauth_states').insertOne({
    state,
    created: new Date()
  });
  
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=r_liteprofile%20r_emailaddress%20w_member_social&` +
    `state=${state}`;
  
  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
    },
    body: '',
  };
}

// Handle LinkedIn callback with authorization code
async function handleLinkedInCallback(event) {
  const { code, state, error } = event.queryStringParameters || {};
  
  // Check for errors
  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Authorization failed: ' + error }),
    };
  }
  
  // Verify state parameter to prevent CSRF
  const db = await connectToDatabase();
  const savedState = await db.collection('oauth_states').findOne({ state });
  
  if (!savedState) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid state parameter' }),
    };
  }
  
  // Delete the used state
  await db.collection('oauth_states').deleteOne({ state });
  
  // Exchange code for access token
  try {
    const clientId = process.env.LINKEDIN_API_KEY;
    const clientSecret = process.env.LINKEDIN_API_SECRET;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || 
                       'https://your-netlify-site.netlify.app/.netlify/functions/auth/callback';
    
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const { access_token, expires_in } = tokenResponse.data;
    
    // Store token in database
    await db.collection('linkedin_tokens').insertOne({
      access_token,
      expires_in,
      expires_at: new Date(Date.now() + expires_in * 1000),
      created_at: new Date()
    });
    
    // Redirect to frontend with success message
    return {
      statusCode: 302,
      headers: {
        Location: '/?auth=success',
      },
      body: '',
    };
  } catch (error) {
    logger.error('Error exchanging code for token:', error.response?.data || error.message);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get access token' }),
    };
  }
}

// Get current LinkedIn auth status
async function getLinkedInStatus() {
  try {
    const db = await connectToDatabase();
    const token = await db.collection('linkedin_tokens')
      .findOne({}, { sort: { created_at: -1 } });
    
    if (!token) {
      return {
        statusCode: 200,
        body: JSON.stringify({ authenticated: false }),
      };
    }
    
    const isExpired = new Date() > new Date(token.expires_at);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        authenticated: !isExpired,
        expiresAt: token.expires_at,
        isExpired
      }),
    };
  } catch (error) {
    logger.error('Error getting LinkedIn status:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error checking authentication status' }),
    };
  }
}
