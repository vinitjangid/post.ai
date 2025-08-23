require('dotenv').config();
const axios = require('axios');

async function testLinkedInAuth() {
    try {
        console.log('Testing LinkedIn API credentials...');
        
        // Check if all required environment variables are set
        const requiredEnvVars = [
            'LINKEDIN_API_KEY',
            'LINKEDIN_API_SECRET', 
            'LINKEDIN_ACCESS_TOKEN',
            'LINKEDIN_PERSON_ID'
        ];
        
        const missingVars = requiredEnvVars.filter(
            varName => !process.env[varName] || process.env[varName].includes('your_')
        );
        
        if (missingVars.length > 0) {
            console.error('Error: Missing or placeholder environment variables:');
            missingVars.forEach(varName => {
                console.error(`- ${varName}`);
            });
            console.error('\nPlease update your .env file with actual values.');
            return false;
        }
        
        // Test API connection
        const apiClient = axios.create({
            baseURL: 'https://api.linkedin.com/v2',
            headers: {
                'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });
        
        // Try to get user profile info
        const response = await apiClient.get(`/me`);
        console.log('LinkedIn API connection successful!');
        console.log('Profile data:', response.data);
        return true;
    } catch (error) {
        console.error('LinkedIn API connection failed:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Error data:', error.response.data);
            
            if (error.response.status === 401) {
                console.error('\nAuthentication failed. Please check your access token.');
            } else if (error.response.status === 403) {
                console.error('\nPermission denied. Make sure your app has the required permissions.');
            }
        } else {
            console.error(error.message);
        }
        return false;
    }
}

testLinkedInAuth()
    .then(success => {
        if (!success) {
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('Unexpected error:', err);
        process.exit(1);
    });
