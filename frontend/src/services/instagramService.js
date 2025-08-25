// Instagram Graph API Service
// This service handles authentication and posting to Instagram using the Graph API

// Constants for Instagram API
const INSTAGRAM_APP_ID = process.env.REACT_APP_INSTAGRAM_APP_ID || '12345678901234567';
const INSTAGRAM_REDIRECT_URI = process.env.REACT_APP_INSTAGRAM_REDIRECT_URI || 
  (window.location.origin + '/instagram-callback');

// Storage keys
const INSTAGRAM_AUTH_KEY = 'instagram_auth';
const INSTAGRAM_USER_DATA_KEY = 'instagram_user_data';

/**
 * Initialize Instagram OAuth flow
 */
export const initiateInstagramAuth = () => {
  // Scopes needed for posting to Instagram
  const scopes = [
    'user_profile', 
    'user_media', 
    'instagram_basic', 
    'pages_show_list',
    'instagram_content_publish'
  ];
  
  // State parameter helps prevent CSRF attacks
  const state = Math.random().toString(36).substring(2);
  localStorage.setItem('instagram_auth_state', state);
  
  // Create and redirect to Instagram authorization URL
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
    `client_id=${INSTAGRAM_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(INSTAGRAM_REDIRECT_URI)}` +
    `&state=${state}` +
    `&scope=${encodeURIComponent(scopes.join(','))}` +
    `&response_type=token`;
  
  window.location.href = authUrl;
};

/**
 * Handle the Instagram OAuth callback
 * This function extracts the auth token from the URL hash and stores it
 */
export const handleInstagramCallback = () => {
  if (!window.location.hash) {
    return { success: false, error: 'No authentication data received.' };
  }

  // Parse the URL hash to get the token
  const params = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = params.get('access_token');
  const state = params.get('state');
  const savedState = localStorage.getItem('instagram_auth_state');
  
  // Validate state to prevent CSRF attacks
  if (state !== savedState) {
    return { 
      success: false, 
      error: 'Invalid state parameter. Authentication may have been compromised.' 
    };
  }
  
  if (!accessToken) {
    return { success: false, error: 'No access token received.' };
  }
  
  // Store the token and clear the state
  localStorage.setItem(INSTAGRAM_AUTH_KEY, accessToken);
  localStorage.removeItem('instagram_auth_state');
  
  // Fetch user data
  return fetchInstagramUserData(accessToken)
    .then(userData => {
      return { success: true, userData };
    })
    .catch(error => {
      return { success: false, error: error.message };
    });
};

/**
 * Check if user is authenticated with Instagram
 */
export const isInstagramAuthenticated = () => {
  const token = localStorage.getItem(INSTAGRAM_AUTH_KEY);
  const userData = localStorage.getItem(INSTAGRAM_USER_DATA_KEY);
  return !!token && !!userData;
};

/**
 * Fetch Instagram user profile data
 */
export const fetchInstagramUserData = async (token = null) => {
  const accessToken = token || localStorage.getItem(INSTAGRAM_AUTH_KEY);
  
  if (!accessToken) {
    throw new Error('No access token available');
  }
  
  try {
    // First get the Facebook User account
    const userResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?access_token=${accessToken}`
    );
    
    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      throw new Error(errorData.error?.message || 'Failed to fetch user data');
    }
    
    const userData = await userResponse.json();
    
    // Now get the connected Instagram business accounts
    const accountsResponse = await fetch(
      `https://graph.facebook.com/v18.0/${userData.id}/accounts?access_token=${accessToken}`
    );
    
    if (!accountsResponse.ok) {
      const errorData = await accountsResponse.json();
      throw new Error(errorData.error?.message || 'Failed to fetch pages data');
    }
    
    const accountsData = await accountsResponse.json();
    
    if (!accountsData.data || accountsData.data.length === 0) {
      throw new Error('No Facebook Pages found. Instagram Business account must be connected to a Facebook Page.');
    }
    
    // Get Instagram business account for the first page
    const pageId = accountsData.data[0].id;
    const pageAccessToken = accountsData.data[0].access_token;
    
    const igAccountResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
    );
    
    if (!igAccountResponse.ok) {
      const errorData = await igAccountResponse.json();
      throw new Error(errorData.error?.message || 'Failed to fetch Instagram account data');
    }
    
    const igAccountData = await igAccountResponse.json();
    
    if (!igAccountData.instagram_business_account) {
      throw new Error('No Instagram Business account connected to this Facebook Page.');
    }
    
    const igBusinessId = igAccountData.instagram_business_account.id;
    
    // Get Instagram business account info
    const igBusinessResponse = await fetch(
      `https://graph.facebook.com/v18.0/${igBusinessId}?fields=name,username,profile_picture_url&access_token=${pageAccessToken}`
    );
    
    if (!igBusinessResponse.ok) {
      const errorData = await igBusinessResponse.json();
      throw new Error(errorData.error?.message || 'Failed to fetch Instagram business profile');
    }
    
    const igBusinessData = await igBusinessResponse.json();
    
    // Store the combined data
    const completeData = {
      userId: userData.id,
      name: userData.name,
      pageId,
      pageAccessToken,
      instagramBusinessId: igBusinessId,
      instagramUsername: igBusinessData.username,
      instagramName: igBusinessData.name,
      profilePicture: igBusinessData.profile_picture_url,
    };
    
    localStorage.setItem(INSTAGRAM_USER_DATA_KEY, JSON.stringify(completeData));
    return completeData;
    
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    throw error;
  }
};

/**
 * Post an image to Instagram
 */
export const postToInstagram = async (imageUrl, caption) => {
  const userData = JSON.parse(localStorage.getItem(INSTAGRAM_USER_DATA_KEY));
  
  if (!userData || !userData.pageAccessToken || !userData.instagramBusinessId) {
    throw new Error('Missing Instagram credentials. Please authenticate first.');
  }
  
  try {
    // 1. Create a container (media object)
    const createContainerResponse = await fetch(
      `https://graph.facebook.com/v18.0/${userData.instagramBusinessId}/media?` +
      `image_url=${encodeURIComponent(imageUrl)}` +
      `&caption=${encodeURIComponent(caption)}` +
      `&access_token=${userData.pageAccessToken}`,
      {
        method: 'POST'
      }
    );
    
    if (!createContainerResponse.ok) {
      const errorData = await createContainerResponse.json();
      throw new Error(errorData.error?.message || 'Failed to create media container');
    }
    
    const containerData = await createContainerResponse.json();
    const containerId = containerData.id;
    
    // 2. Publish the container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${userData.instagramBusinessId}/media_publish?` +
      `creation_id=${containerId}` +
      `&access_token=${userData.pageAccessToken}`,
      {
        method: 'POST'
      }
    );
    
    if (!publishResponse.ok) {
      const errorData = await publishResponse.json();
      throw new Error(errorData.error?.message || 'Failed to publish to Instagram');
    }
    
    const publishData = await publishResponse.json();
    
    return {
      success: true,
      postId: publishData.id,
      message: 'Successfully posted to Instagram!'
    };
    
  } catch (error) {
    console.error('Error posting to Instagram:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Logout from Instagram
 */
export const logoutInstagram = () => {
  localStorage.removeItem(INSTAGRAM_AUTH_KEY);
  localStorage.removeItem(INSTAGRAM_USER_DATA_KEY);
  return { success: true };
};

/**
 * Get stored Instagram user data
 */
export const getInstagramUserData = () => {
  const userData = localStorage.getItem(INSTAGRAM_USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};
