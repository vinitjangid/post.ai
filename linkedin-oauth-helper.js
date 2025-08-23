/**
 * LinkedIn OAuth Helper
 * 
 * This script generates the OAuth authorization URL for LinkedIn API access
 * and helps with the token exchange process.
 * 
 * Run with: node linkedin-oauth-helper.js
 */

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

// Parse command line arguments
const args = process.argv.slice(2);
let productionUrl = null;

// Check for production URL argument
for (const arg of args) {
  if (arg.startsWith('--url=')) {
    productionUrl = arg.split('=')[1];
  }
}

// Configuration from .env file
const clientId = process.env.LINKEDIN_API_KEY;
const clientSecret = process.env.LINKEDIN_API_SECRET;

// Use production URL if provided, otherwise use local development
let redirectUri;
if (productionUrl) {
  redirectUri = `${productionUrl}/auth/linkedin/callback`;
  console.log(`\nUsing production URL: ${productionUrl}`);
} else {
  redirectUri = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3030/callback';
  console.log('\nUsing development URL. For production, use: node linkedin-oauth-helper.js --url=https://your-app.com');
}

// Generate a random state value for CSRF protection
const state = crypto.randomBytes(16).toString('hex');

// Create a simple express server to handle the callback
const app = express();
const PORT = productionUrl ? 3000 : 3030;
const callbackPath = productionUrl ? '/auth/linkedin/callback' : '/callback';

// Display the authorization URL
console.log('\n====================== LINKEDIN OAUTH HELPER ======================');
console.log('\nStep 1: Copy and open this URL in your browser to authorize your app:');
console.log(`\nhttps://www.linkedin.com/oauth/v2/authorization?`+
  `response_type=code&` +
  `client_id=${clientId}&` +
  `redirect_uri=${encodeURIComponent(redirectUri)}&` +
  `scope=r_liteprofile%20r_emailaddress%20w_member_social&` +
  `state=${state}`);
console.log('\nAfter authorization, you will be redirected to a callback URL where the access token will be retrieved.');

// Handle the callback from LinkedIn
app.get(callbackPath, async (req, res) => {
  const { code, state: returnedState, error } = req.query;

  // Check if there was an error
  if (error) {
    console.error('OAuth Error:', error);
    return res.send('Authentication failed: ' + error);
  }

  // Check if state matches (CSRF protection)
  if (returnedState !== state) {
    console.error('State mismatch - possible CSRF attack');
    return res.send('Authentication failed: state mismatch');
  }

  // Exchange the authorization code for an access token
  try {
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

    const accessToken = tokenResponse.data.access_token;
    const expiresIn = tokenResponse.data.expires_in;
    const expiryDate = new Date(Date.now() + expiresIn * 1000).toLocaleString();

    console.log('\n====================== SUCCESS ======================');
    console.log('\nAccess Token Retrieved!');
    console.log('\nAdd this to your .env file:');
    console.log(`\nLINKEDIN_ACCESS_TOKEN=${accessToken}`);
    console.log(`\nToken expires in ${expiresIn} seconds (${expiryDate})`);
    console.log('\nGet your LinkedIn Person ID:');
    console.log('1. Go to https://www.linkedin.com/developers/tools/get-urn-id');
    console.log('2. Enter your LinkedIn profile URL');
    console.log('3. Copy the ID and add it to your .env file as LINKEDIN_PERSON_ID');
    console.log('\n=====================================================');

    // Also display in browser
    res.send(`
      <h1>Access Token Retrieved!</h1>
      <p><strong>Access Token:</strong> ${accessToken}</p>
      <p><strong>Expires in:</strong> ${expiresIn} seconds (${expiryDate})</p>
      <p><strong>Add this to your .env file:</strong><br>
      <code>LINKEDIN_ACCESS_TOKEN=${accessToken}</code></p>
      <p>Now go back to the terminal for next steps.</p>
    `);
    
    // Keep the server running for a while to make sure the user gets the info
    setTimeout(() => {
      console.log('\nHelper server shutting down...');
      process.exit(0);
    }, 60000); // Keep running for 1 minute
    
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.send('Failed to get access token. See terminal for details.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`\nOAuth helper server started on http://localhost:${PORT}`);
  console.log('\n=====================================================');
});
