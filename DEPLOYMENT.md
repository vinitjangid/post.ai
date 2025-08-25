# LinkedIn JS Tips Poster - Frontend Only Version

A React application that posts JavaScript and React tips to LinkedIn, using a frontend-only approach.

## Deployment Guide

This guide explains how to deploy this simplified frontend-only application to various free hosting platforms.

### Option 1: Deploy to Netlify

[Netlify](https://www.netlify.com/) is perfect for hosting static React applications.

1. Sign up for a free Netlify account
2. Connect your GitHub repository
3. Configure the build settings:
   - **Base directory**: (leave empty)
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
4. Add Environment Variables:
   ```
   REACT_APP_LINKEDIN_CLIENT_ID=your_linkedin_client_id
   ```
5. Configure redirects by adding a `_redirects` file in the `frontend/public` directory with:
   ```
   /*    /index.html   200
   ```
5. Deploy the application

### Option 2: Deploy to Railway

[Railway](https://railway.app/) provides a simple deployment platform with free tier.

1. Install the Railway CLI: `npm i -g @railway/cli`
2. Login to Railway: `railway login`
3. Initialize the project: `railway init`
4. Add a MongoDB database: `railway add`
5. Deploy the app: `railway up`
6. Set up environment variables through the Railway dashboard

### Option 3: Deploy to Fly.io

[Fly.io](https://fly.io/) offers global app deployment with a generous free tier.

1. Install the Flyctl CLI:
   ```
   curl -L https://fly.io/install.sh | sh
   ```
2. Login: `fly auth login`
3. Launch the app: `fly launch`
4. Deploy: `fly deploy`
5. Set secrets: `fly secrets set LINKEDIN_API_KEY=your_key` (repeat for all env vars)

## Database Setup

### MongoDB Atlas (Recommended)

1. Sign up for a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a free cluster
3. Set up a database user and password
4. Whitelist all IP addresses (`0.0.0.0/0`) for development
5. Get your connection string from the "Connect" button
6. Add the connection string to your environment variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkedin-js-tips
   ```

### Supabase (PostgreSQL Alternative)

1. Sign up for [Supabase](https://supabase.com/)
2. Create a new project
3. Get your connection string
4. Add the driver: `npm install pg`
5. Update the database.js file to use PostgreSQL

## Updating LinkedIn Redirect URI

After deployment, update your LinkedIn Developer App settings:

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Select your app
3. Go to "Auth" tab
4. Add your production redirect URI:
   - `https://your-app-name.onrender.com/auth/linkedin/callback`
   - `https://your-app-name.fly.dev/auth/linkedin/callback`
   - `https://your-app-name.up.railway.app/auth/linkedin/callback`

Remember to also update your `.env` file and app configuration with this new URI.

## Getting Fresh LinkedIn Access Tokens

For production deployment, update the OAuth helper:

```bash
# Update the helper script with your production URL
node linkedin-oauth-helper.js --url=https://your-production-url.com
```
