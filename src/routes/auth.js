const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config/config');
const { logger } = require('../utils/logger');

// LinkedIn OAuth configuration
const linkedinConfig = {
  clientId: config.linkedin.apiKey,
  clientSecret: config.linkedin.apiSecret,
  redirectUri: config.linkedin.redirectUri,
};

/**
 * Route to initiate the LinkedIn OAuth flow
 */
router.get('/linkedin/auth', (req, res) => {
  // Generate a random state value for CSRF protection
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state in session or cookie
  req.session = req.session || {};
  req.session.linkedinState = state;
  
  // Construct the authorization URL
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${linkedinConfig.clientId}&` +
    `redirect_uri=${encodeURIComponent(linkedinConfig.redirectUri)}&` +
    `scope=r_liteprofile%20r_emailaddress%20w_member_social&` +
    `state=${state}`;
  
  // Redirect the user to LinkedIn for authorization
  res.redirect(authUrl);
});

/**
 * Callback route that LinkedIn redirects to after user authorization
 */
router.get('/linkedin/callback', async (req, res) => {
  const { code, state, error } = req.query;
  
  // Check for errors
  if (error) {
    logger.error('LinkedIn OAuth error:', error);
    return res.redirect('/settings?error=' + encodeURIComponent('LinkedIn authentication failed'));
  }
  
  // Verify the state parameter to prevent CSRF attacks
  if (req.session && state !== req.session.linkedinState) {
    logger.error('LinkedIn OAuth state mismatch - possible CSRF attack');
    return res.redirect('/settings?error=' + encodeURIComponent('Security verification failed'));
  }
  
  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: linkedinConfig.clientId,
        client_secret: linkedinConfig.clientSecret,
        redirect_uri: linkedinConfig.redirectUri
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const { access_token, expires_in } = tokenResponse.data;
    
    // Store the access token securely
    // In a real app, you might store this in a database
    // For now, we'll just log it (but in production, never log tokens)
    logger.info(`LinkedIn access token obtained. Expires in ${expires_in} seconds.`);
    
    // Get the user's profile information to verify the token works
    const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    
    const userId = profileResponse.data.id;
    logger.info(`LinkedIn profile verified for user ID: ${userId}`);
    
    // Store the token and user ID for the application to use
    // In a real app, store these in a secure database
    // Here we're just updating our in-memory configuration
    config.linkedin.accessToken = access_token;
    config.linkedin.personId = userId;
    
    // If the global service exists, update its configuration
    if (global.linkedinService) {
      global.linkedinService.config.accessToken = access_token;
      global.linkedinService.config.personId = userId;
      
      // Update the API client's authorization header
      global.linkedinService.apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    }
    
    // Redirect to the settings page with success message
    res.redirect('/settings?success=true&message=' + encodeURIComponent('LinkedIn account connected successfully'));
    
  } catch (error) {
    logger.error('Error during LinkedIn OAuth token exchange:', error.response?.data || error.message);
    res.redirect('/settings?error=' + encodeURIComponent('Failed to connect LinkedIn account'));
  }
});

/**
 * Route to get LinkedIn connection status
 */
router.get('/linkedin/status', (req, res) => {
  const isConnected = !!(config.linkedin.accessToken && config.linkedin.personId);
  
  res.json({
    connected: isConnected,
    // Only send limited information about the connection, not the actual token
    profile: isConnected ? {
      id: config.linkedin.personId
    } : null
  });
});

/**
 * Route to disconnect LinkedIn account
 */
router.post('/linkedin/disconnect', (req, res) => {
  // Clear the stored credentials
  config.linkedin.accessToken = null;
  config.linkedin.personId = null;
  
  // If the global service exists, update its configuration
  if (global.linkedinService) {
    global.linkedinService.config.accessToken = null;
    global.linkedinService.config.personId = null;
    
    // Reset the API client's authorization header
    delete global.linkedinService.apiClient.defaults.headers.common['Authorization'];
  }
  
  res.json({ success: true, message: 'LinkedIn account disconnected successfully' });
});

module.exports = router;
