# Instagram Setup Instructions

This document provides detailed instructions on how to set up Instagram API access for your LinkedIn JS Tips Poster application.

## Prerequisites

1. A Facebook Developer account
2. A Facebook Page
3. An Instagram Business or Creator account that's connected to your Facebook Page

## Setting Up Instagram Graph API Access

### Step 1: Create a Facebook Developer App

1. Go to [Facebook Developer Portal](https://developers.facebook.com/)
2. Log in with your Facebook account
3. Click "My Apps" and then "Create App"
4. Choose "Business" as your app type
5. Fill in the required details and create your app

### Step 2: Add Instagram Basic Display to Your App

1. From your app dashboard, click "Add Products" in the left sidebar
2. Find "Instagram Basic Display" and click "Set Up"
3. Add the following to your "Valid OAuth Redirect URIs":
   - For local development: `http://localhost:3000/instagram-callback`
   - For production: `https://your-app-name.netlify.app/instagram-callback`

### Step 3: Configure App Settings

1. Go to "Settings" > "Basic" and note your App ID
2. Go to your app dashboard and add the following permissions to your app:
   - `user_profile`
   - `user_media`
   - `instagram_basic`
   - `pages_show_list`
   - `instagram_content_publish`

### Step 4: Connect Your Facebook Page and Instagram Account

1. Make sure your Instagram Business account is properly connected to your Facebook Page:
   - Go to your Facebook Page
   - Click "Settings" > "Instagram"
   - Follow the instructions to connect your Instagram account

### Step 5: Configure Your Application

1. Add your Instagram App ID to your environment variables:

   For local development, add to `.env.development`:
   ```
   REACT_APP_INSTAGRAM_APP_ID=your_app_id_here
   REACT_APP_INSTAGRAM_REDIRECT_URI=http://localhost:3000/instagram-callback
   ```

   For production, add to Netlify environment variables:
   ```
   REACT_APP_INSTAGRAM_APP_ID=your_app_id_here
   REACT_APP_INSTAGRAM_REDIRECT_URI=https://your-app-name.netlify.app/instagram-callback
   ```

## Testing Your Instagram Integration

1. Start your application
2. Go to the Settings page
3. Click "Connect Instagram Account"
4. You should be redirected to Instagram for authorization
5. After authorization, you'll be redirected back to your app
6. Go to the Instagram Post page to test posting an image to Instagram

## Troubleshooting

### Common Issues:

1. **Access Token Issues**:
   Make sure you've requested the right permissions and that your app is properly configured.

2. **Redirect URI Errors**:
   Verify that the redirect URI is exactly as registered in your Facebook app.

3. **API Call Failures**:
   Check the browser console for more detailed error messages. Ensure your Instagram account is a Business or Creator account.

4. **Invalid Instagram Business Account**:
   Make sure your Instagram account is properly connected to a Facebook Page and is set as a Business or Creator account.

### Additional Resources:

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Facebook for Developers](https://developers.facebook.com/docs)
