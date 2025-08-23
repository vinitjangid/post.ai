require('dotenv').config();

module.exports = {
    linkedin: {
        apiKey: process.env.LINKEDIN_API_KEY,
        apiSecret: process.env.LINKEDIN_API_SECRET,
        accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
        redirectUri: process.env.LINKEDIN_REDIRECT_URI,
        personId: process.env.LINKEDIN_PERSON_ID || 'your-linkedin-id'
    },
    postInterval: process.env.POST_INTERVAL || '86400000',
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/linkedin-js-tips',
    },
    app: {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development',
        baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    }
};