# Netlify Deployment Guide for LinkedIn JS Tips Poster

This guide explains how to properly deploy the frontend-only version of the LinkedIn JS Tips Poster application to Netlify.

## Step 1: Prepare Your Application for Production

1. Update the LinkedIn redirect URL in `src/services/linkedinAuthService.js`:
   ```javascript
   redirectUri: process.env.NODE_ENV === 'production'
     ? 'https://your-actual-netlify-domain.netlify.app/auth/linkedin/callback'
     : window.location.origin + '/auth/linkedin/callback',
   ```

2. Create a production environment file:
   ```
   cp frontend/.env.production.example frontend/.env.production
   ```

3. Edit `frontend/.env.production` and add your LinkedIn Client ID:
   ```
   REACT_APP_LINKEDIN_CLIENT_ID=your_actual_linkedin_client_id
   ```

## Step 2: Deploy to Netlify

### Option 1: Deploy via Netlify UI

1. Build your application locally:
   ```
   npm run build
   ```

2. Drag and drop the `frontend/build` folder to the Netlify deploy area at [app.netlify.com](https://app.netlify.com)

### Option 2: Connect to Git Repository (Recommended)

1. Push your code to GitHub, GitLab, or Bitbucket
2. Log in to [Netlify](https://app.netlify.com)
3. Click "New site from Git" and connect to your repository
4. Configure build settings:
   - Build command: `npm run install-deps && npm run build`
   - Publish directory: `frontend/build`
5. Click "Deploy site"

## Step 3: Configure Environment Variables in Netlify

1. Once your site is deployed, go to Site settings > Build & deploy > Environment
2. Add the following environment variable:
   ```
   REACT_APP_LINKEDIN_CLIENT_ID=your_actual_linkedin_client_id
   ```
3. Trigger a new deployment for the changes to take effect

## Step 4: Update LinkedIn Developer App Settings

1. Go to the [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
2. Select your app and go to the "Auth" tab
3. Add the production redirect URL with your actual Netlify domain:
   ```
   https://your-netlify-site-name.netlify.app/auth/linkedin/callback
   ```
4. Save your changes

## Step 5: Test Your Deployed Application

1. Visit your Netlify site URL
2. Try connecting your LinkedIn account through the Settings page
3. Create a post and verify it's published to LinkedIn
4. Check that the authentication flow works properly with the production redirect URL

## Troubleshooting Netlify Deployments

- **Build failures**: Check the Netlify deploy logs for errors
- **Redirect issues**: Verify the `_redirects` file is being copied to your build folder
- **Authentication failures**: Confirm that your LinkedIn Developer App settings have the correct redirect URL
- **Environment variables not working**: Make sure they are properly set in the Netlify dashboard
- **Client-side routing 404s**: Check that the redirect rule in `netlify.toml` is working properly
