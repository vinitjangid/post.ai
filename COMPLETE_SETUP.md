# Complete Setup Guide for LinkedIn JS Tips Poster - Frontend Only Version

This guide covers setting up the LinkedIn OAuth for the frontend-only version of the application.

## LinkedIn OAuth Setup

This simplified version of the application is a frontend-only React app that interacts directly with the LinkedIn API without requiring a backend server or database. All post data is stored in the browser's local storage.
   ```

## Part 2: LinkedIn OAuth Setup

### Step 1: Create a LinkedIn Developer Application

1. Go to the [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
2. Click the "Create App" button
3. Fill in the required information:
   - **App Name**: LinkedIn JS Tips Poster
   - **LinkedIn Page**: Your company page (or personal LinkedIn URL)
   - **App Logo**: Upload an appropriate logo
   - **Legal Agreement**: Check the box to agree to terms
4. Click "Create App"

### Step 2: Configure OAuth Settings

1. In your app dashboard, go to the "Auth" tab
2. Note your **Client ID** and **Client Secret**
3. Add the following Redirect URLs:
   - For development: `http://localhost:3000/auth/linkedin/callback`
   - For Netlify: `https://your-site-name.netlify.app/.netlify/functions/auth/callback`
4. Under OAuth 2.0 scopes, select:
   - `r_liteprofile`
   - `r_emailaddress`
   - `w_member_social`
5. Click "Update" to save changes

### Step 3: Update Your .env File

Add your LinkedIn credentials to your `.env` file:

```
LINKEDIN_API_KEY=your_client_id_here
LINKEDIN_API_SECRET=your_client_secret_here
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback
```

### Step 4: Generate Access Token Using the Helper Tool

1. Run the OAuth helper:
   ```
   node linkedin-oauth-helper.js
   ```
2. Open the generated URL in your browser
3. Authorize your application
4. The access token will be displayed in your browser and terminal
5. Copy the access token to your `.env` file:
   ```
   LINKEDIN_ACCESS_TOKEN=your_access_token_here
   ```

### Step 5: Get Your LinkedIn Person ID

1. Go to [LinkedIn URN ID Tool](https://www.linkedin.com/developers/tools/get-urn-id)
2. Enter your LinkedIn profile URL
3. Copy the generated Person ID (it will look like `abc123def`)
4. Add it to your `.env` file:
   ```
   LINKEDIN_PERSON_ID=your_person_id_here
   ```

## Part 3: Testing Your Setup

### Step 1: Start Your Application

```
npm run dev
```

### Step 2: Test LinkedIn Integration

1. Go to `http://localhost:3000` in your browser
2. Navigate to the Dashboard
3. Try creating and posting content to LinkedIn
4. Check your LinkedIn profile to verify the post was published

### Step 3: Test MongoDB Integration

1. Create some posts through the application
2. Check that they're saved and appear in the post history
3. You can verify the data in MongoDB Atlas by going to your cluster, clicking "Browse Collections"

## Part 4: Netlify Deployment

When ready to deploy to Netlify:

1. Run the OAuth helper with your Netlify URL:
   ```
   node linkedin-oauth-helper.js --url=https://your-site-name.netlify.app
   ```
   
2. Add these environment variables in Netlify:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `LINKEDIN_API_KEY`: Your LinkedIn Client ID
   - `LINKEDIN_API_SECRET`: Your LinkedIn Client Secret
   - `LINKEDIN_REDIRECT_URI`: `https://your-site-name.netlify.app/.netlify/functions/auth/callback`
   - `LINKEDIN_ACCESS_TOKEN`: Your LinkedIn Access Token
   - `LINKEDIN_PERSON_ID`: Your LinkedIn Person ID
   - `NODE_ENV`: `production`
   - `SESSION_SECRET`: A random secure string

3. Update your LinkedIn Developer App with the Netlify callback URL

## Troubleshooting

### MongoDB Issues:
- **Connection errors**: Check your connection string and network access settings
- **Authentication failed**: Verify your username and password
- **Database not found**: Make sure the database name is correct in your connection string

### LinkedIn OAuth Issues:
- **Invalid redirect URI**: Make sure the redirect URI in your app settings exactly matches what's in your code
- **Authorization failed**: Check that you've selected all required OAuth scopes
- **Post creation failed**: Verify your access token is valid and has not expired
- **"Person not found" error**: Double-check your LinkedIn Person ID is correct
