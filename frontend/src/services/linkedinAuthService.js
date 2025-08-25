/**
 * LinkedIn OAuth Helper for Frontend-Only Implementation
 * 
 * This is a simplified version that handles LinkedIn authentication
 * directly from the browser using the Implicit OAuth flow.
 * 
 * NOTE: This is for demonstration purposes and would typically be
 * handled more securely through a backend server.
 */

// LinkedIn OAuth Configuration
const config = {
  // LinkedIn Client ID from environment variables
  clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID || 'YOUR_LINKEDIN_CLIENT_ID',
  
  // Use different redirect URIs for development and production
  // In production, we use the actual Netlify domain from environment variables
  redirectUri: process.env.NODE_ENV === 'production' && process.env.REACT_APP_NETLIFY_URL
    ? `${process.env.REACT_APP_NETLIFY_URL}/auth/linkedin/callback`
    : window.location.origin + '/auth/linkedin/callback',
  
  scope: 'r_liteprofile r_emailaddress w_member_social',
};

/**
 * Initiates LinkedIn OAuth flow
 */
export const initiateLinkedInAuth = () => {
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=token&client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${encodeURIComponent(config.scope)}&state=${generateRandomState()}`;
  window.location.href = authUrl;
};

/**
 * Handle the OAuth callback and extract token
 */
export const handleOAuthCallback = () => {
  if (window.location.hash) {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get('access_token');
    if (accessToken) {
      localStorage.setItem('linkedin_token', accessToken);
      // Remove the hash from the URL to prevent token exposure
      window.history.replaceState({}, document.title, window.location.pathname);
      return accessToken;
    }
  }
  return null;
};

/**
 * Generate a random state value for OAuth security
 */
function generateRandomState() {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Check if user is authenticated with LinkedIn
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('linkedin_token');
};

/**
 * Get the current LinkedIn access token
 */
export const getToken = () => {
  return localStorage.getItem('linkedin_token');
};

/**
 * Logout from LinkedIn
 */
export const logout = () => {
  localStorage.removeItem('linkedin_token');
  localStorage.removeItem('linkedin_user_data');
};
