# LinkedIn JavaScript Tips Poster - Frontend 4. **Set up LinkedIn OAuth credentials:**
   - Create a LinkedIn Developer app at [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
   - Set redirect URL to `http://localhost:3000/auth/linkedin/callback` for development
   - Copy your Client ID to `.env` file:
     ```
     REACT_APP_LINKEDIN_CLIENT_ID=your_client_id_here
     ```
   - See `LINKEDIN_AUTH_SETUP.md` for detailed instructions

5. **Start the development server:**
   ```
   npm start
   ```

6. **Build for production:**
   ```
   npm run build
   ```

7. **Deploy to Netlify:**
   ```
   npm run deploy
   ```
   For detailed deployment instructions, see [NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md)

## LinkedIn Authentication Process

This app uses the frontend OAuth flow for LinkedIn:
1. User clicks "Connect with LinkedIn" button
2. User is redirected to LinkedIn for authentication
3. After successful authentication, LinkedIn redirects back to the callback URL
4. The app extracts the access token and stores it in localStorage
5. User can now create and share posts directly to LinkedIn

## Deployment to Netlify

This application can be easily deployed to Netlify:
1. Use the provided `npm run deploy` script
2. Or follow the manual deployment instructions in [NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md)
3. After deployment, update your LinkedIn Developer App settings with your Netlify URL
4. Configure environment variables in the Netlify dashboard
This is a simplified, frontend-only version of the LinkedIn JavaScript Tips Poster application. It allows you to create and share JavaScript and React tips directly to LinkedIn from a React web interface.

## Features

- Create and share JavaScript and React tips to LinkedIn
- Post Multiple Choice Questions (MCQs) to engage your audience
- View post history and analytics
- Upload images to accompany your posts
- Store post data in browser localStorage

## Project Structure

```
linkedin-js-tips-poster
├── frontend
│   ├── src
│   │   ├── index.js              # Entry point of the application
│   │   ├── App.js                # Main application component
│   │   ├── components            # UI components
│   │   ├── data                  # Local data storage
│   │   │   ├── javascriptTips.json  # JavaScript tips
│   │   │   ├── reactTips.json       # React tips
│   │   │   ├── mcqQuestions.json    # MCQs
│   │   │   └── instagramTemplates.json # Instagram image templates
│   │   └── services              # API services
│   │       ├── apiService.js        # API service for data operations
│   │       ├── linkedinAuthService.js # LinkedIn authentication
│   │       └── instagramService.js  # Instagram API integration
│   ├── public                    # Public assets
│   └── package.json              # Frontend dependencies
├── package.json                  # Project configuration
├── README.md                     # Project documentation
├── LINKEDIN_AUTH_SETUP.md        # LinkedIn setup instructions
└── INSTAGRAM_SETUP.md            # Instagram setup instructions
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd linkedin-js-tips-poster
   ```

2. **Install dependencies:**
   ```
   npm run install-deps
   ```

3. **Start the development server:**
   ```
   npm start
   ```

4. **Build for production:**
   ```
   npm run build
   ```

## Social Media Authentication

### LinkedIn Authentication

To post to LinkedIn, you'll need to set up LinkedIn OAuth credentials. Follow the instructions in `LINKEDIN_AUTH_SETUP.md` to set up your LinkedIn API access.

### Instagram Authentication

To post images to Instagram, you'll need to set up Instagram Graph API access. Follow the instructions in `INSTAGRAM_SETUP.md` to set up your Instagram API access.

## Usage

### LinkedIn Posts
The application will automatically post a random JavaScript or React tip to LinkedIn every day. You can modify the tips in the `src/data/javascriptTips.json` and `src/data/reactTips.json` files as needed.

### Instagram Posts
You can create and post image-based JavaScript and React tips to your connected Instagram Business account. The app provides templates for creating visually appealing code tips for Instagram.

## Contributing

Feel free to submit issues or pull requests for improvements or additional features.