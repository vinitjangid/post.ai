# Netlify Deployment Instructions

This guide will walk you through deploying the LinkedIn JS Tips Poster application to Netlify.

## Option 1: Automated Deployment via CLI (Recommended)

This is the easiest way to deploy your application to Netlify.

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your computer
- A [Netlify account](https://app.netlify.com/signup)
- A [LinkedIn Developer account](https://www.linkedin.com/developers/) with a registered app

### Steps

1. **Make the deployment script executable**:
   ```bash
   chmod +x deploy-netlify.sh
   ```

2. **Run the deployment script**:
   ```bash
   ./deploy-netlify.sh
   ```

3. **Follow the prompts** in the script to complete the deployment.

4. **After deployment**:
   - Note your Netlify URL (e.g., `https://your-site-name.netlify.app`)
   - Update your LinkedIn Developer App settings with your Netlify URL
   - Add environment variables in the Netlify dashboard

## Option 2: Manual Deployment via Netlify Dashboard

If you prefer using the Netlify web interface, follow these steps.

### Steps

1. **Build your application**:
   ```bash
   npm run install-deps
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [Netlify](https://app.netlify.com/)
   - Log in to your account
   - Drag and drop the `frontend/build` folder onto the Netlify dashboard
   - Wait for the deployment to complete
   - Note your Netlify URL

3. **Configure LinkedIn Developer App**:
   - Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
   - Select your app
   - Go to the "Auth" tab
   - Add redirect URL: `https://your-site-name.netlify.app/auth/linkedin/callback`
   - Save changes

4. **Configure Environment Variables**:
   - Go to your site dashboard in Netlify
   - Navigate to Site settings > Build & deploy > Environment
   - Add the following environment variables:
     - `REACT_APP_LINKEDIN_CLIENT_ID`: Your LinkedIn Client ID
     - `REACT_APP_NETLIFY_URL`: Your Netlify site URL (without trailing slash)
   - Trigger a new deploy for the changes to take effect

## Option 3: Continuous Deployment from Git

For continuous deployment whenever you push changes to your repository:

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket).

2. **Set up continuous deployment**:
   - Go to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Select your Git provider and repository
   - Configure build settings:
     - Build command: `npm run install-deps && npm run build`
     - Publish directory: `frontend/build`
   - Click "Deploy site"

3. **Configure environment variables** in the Netlify dashboard as described in Option 2.

4. **Update LinkedIn Developer App settings** with your Netlify URL.

## Troubleshooting

- **Build failures**: Check the Netlify deploy logs for errors
- **Authentication issues**: Verify that your LinkedIn redirect URL matches your Netlify domain exactly
- **Environment variables not working**: Make sure they are properly set in the Netlify dashboard
- **Redirect issues**: Check that your `netlify.toml` file is correctly configured

## Testing Your Deployment

After deploying:

1. Visit your Netlify site URL
2. Go to Settings and click "Connect with LinkedIn"
3. Complete the authentication process
4. Try creating and sharing a post
5. Verify that the post appears on your LinkedIn profile
