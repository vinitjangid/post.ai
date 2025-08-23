# LinkedIn API Setup Guide

This guide will help you set up LinkedIn API integration for the LinkedIn JS Tips Poster application.

## 1. Create a LinkedIn Developer Application

1. Go to the [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Sign in with your LinkedIn account
3. Click "Create app" and fill in the required information:
   - App name: "LinkedIn JS Tips Poster"
   - Company: Your company/personal name
   - Privacy policy URL: Your privacy policy URL (can be a GitHub page)
   - Business email: Your email address
   - App logo: Upload a logo for your app
   - App description: "Application to post JavaScript tips to LinkedIn"

## 2. Configure the LinkedIn Application

1. Once your app is created, go to the "Products" tab
2. Request access to the following products:
   - **Share on LinkedIn** - Required for posting content
   - **Sign In with LinkedIn** - Required for authentication

3. Go to the "Auth" tab and add the following OAuth 2.0 scopes:
   - `r_liteprofile` - to access your basic profile
   - `r_emailaddress` - to access your email address
   - `w_member_social` - to post on your behalf

4. Add a redirect URL:
   - For development: `http://localhost:3000/auth/linkedin/callback`
   - For production: Add your production callback URL

## 3. Get Your LinkedIn Person ID

1. Go to your LinkedIn profile page
2. Look at the URL, it should look like: `https://www.linkedin.com/in/your-profile-name/`
3. Go to [this tool](https://www.linkedin.com/developers/tools/get-urn-id) and paste your LinkedIn URL
4. Get your LinkedIn Person ID (it should look like: `abcdef123`)

## 4. Get an Access Token for LinkedIn API

### Method 1: Using the API Explorer

1. In your LinkedIn Developer application dashboard, go to "API Tools" > "API Explorer"
2. Request a token with the required scopes: `r_liteprofile`, `r_emailaddress`, `w_member_social`
3. Click "Request Token" and authorize the app
4. Copy the generated access token

Note: Tokens generated this way are valid for 60 days and are useful for testing.

### Method 2: Implementing OAuth 2.0 Flow (For Production)

For a production environment, implement the complete OAuth 2.0 flow:

1. Create an authorization URL:
```
https://www.linkedin.com/oauth/v2/authorization?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URL&
  scope=r_liteprofile,r_emailaddress,w_member_social&
  state=random_state_value
```

2. After the user authorizes your app, LinkedIn redirects to your redirect URI with an authorization code
3. Exchange this code for an access token by making a POST request to:
```
POST https://www.linkedin.com/oauth/v2/accessToken
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTHORIZATION_CODE&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET&
redirect_uri=YOUR_REDIRECT_URL
```

4. Store the returned access token and refresh token securely

## 5. Update Your Environment Variables

Create a `.env` file in the root directory of your project with the following variables:

```
LINKEDIN_API_KEY=your_client_id_here
LINKEDIN_API_SECRET=your_client_secret_here
LINKEDIN_ACCESS_TOKEN=your_access_token_here
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback
LINKEDIN_PERSON_ID=your_linkedin_id_here
PORT=3000
POST_INTERVAL=86400000 # 24 hours in milliseconds
```

## 6. Testing Your Setup

After setting up the environment variables, restart your application and test a post:

1. Go to the "Create Post" page in the app
2. Create and submit a test post
3. Check your LinkedIn profile to confirm the post was published

## Troubleshooting

- **401 Unauthorized Errors**: Verify your access token is valid and has the correct permissions
- **400 Bad Request Errors**: Check your post format matches LinkedIn's requirements
- **403 Forbidden Errors**: Ensure your application has been approved for the necessary scopes

If your access token expires, you'll need to generate a new one using one of the methods above.

## Resources

- [LinkedIn Marketing Developer Platform Documentation](https://learn.microsoft.com/en-us/linkedin/marketing/)
- [LinkedIn API Documentation](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow)
- [LinkedIn UGC Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/ugc-post-api)
