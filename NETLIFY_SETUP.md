# Netlify Deployment Guide

This guide explains how to deploy the LinkedIn JavaScript Tips Poster application to Netlify.

## Steps to Deploy on Netlify

### 1. Connect to GitHub Repository

1. Sign in to your Netlify account
2. Click on the "New site from Git" button
3. Choose "GitHub" as your Git provider
4. Authorize Netlify to access your GitHub account if prompted
5. Select the repository `vinitjangid/post.ai`
6. Configure the deployment settings:
   - **Branch to deploy**: `main`
   - **Build command**: `npm install && cd frontend && npm install && npm run build`
   - **Publish directory**: `frontend/build`
   - Click "Show advanced" and set **Functions directory**: `src/functions`

### 2. Configure Environment Variables

After deploying, you need to set up environment variables in Netlify:

1. Go to your site's dashboard in Netlify
2. Navigate to "Site settings" → "Environment variables"
3. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas)
   - `LINKEDIN_API_KEY`: Your LinkedIn API key
   - `LINKEDIN_API_SECRET`: Your LinkedIn API secret
   - `LINKEDIN_REDIRECT_URI`: `https://your-site-name.netlify.app/.netlify/functions/auth/callback`
   - `LINKEDIN_ACCESS_TOKEN`: Your LinkedIn access token (generated with oauth-helper)
   - `LINKEDIN_PERSON_ID`: Your LinkedIn person ID

### 3. Set Up MongoDB Atlas (if not already done)

1. Create a MongoDB Atlas account
2. Create a free cluster
3. Create a database user with read/write permissions
4. Configure network access (whitelist all IPs with `0.0.0.0/0`)
5. Get your connection string and add it as `MONGODB_URI` environment variable in Netlify

### 4. Update LinkedIn Developer App Settings

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps/)
2. Select your application
3. Go to "Auth" tab
4. Add your production redirect URI: `https://your-site-name.netlify.app/.netlify/functions/auth/callback`
5. Save changes

### 5. Generate a New LinkedIn Access Token

After deployment is complete:

1. Update your local `.env` file with your Netlify URL:
   ```
   LINKEDIN_REDIRECT_URI=https://your-site-name.netlify.app/.netlify/functions/auth/callback
   ```

2. Run the OAuth helper with your Netlify URL:
   ```
   node linkedin-oauth-helper.js --url=https://your-site-name.netlify.app
   ```

3. Follow the authentication process to generate a new access token
4. Update the `LINKEDIN_ACCESS_TOKEN` in your Netlify environment variables

### 6. Verify Deployment

1. Visit your Netlify URL: `https://your-site-name.netlify.app`
2. Check the dashboard and ensure it's loading data correctly
3. Test creating a post (it should store in MongoDB)
4. Check the Functions tab in Netlify to ensure functions are working properly

### Troubleshooting

- **Function errors**: Check the Functions log in Netlify dashboard
- **Build errors**: Review the deploy log for any build issues
- **MongoDB connection issues**: Verify your connection string and network settings
- **LinkedIn OAuth errors**: Double-check the redirect URI in both your app settings and environment variables

### Maintaining Your Application

1. Push changes to your GitHub repository to trigger automatic deployments
2. Refresh your LinkedIn access token before it expires (60 days)
3. Monitor your MongoDB storage usage and performance
