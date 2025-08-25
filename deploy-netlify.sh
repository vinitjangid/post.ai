#!/bin/bash

# Netlify deployment script for LinkedIn JS Tips Poster
# This script will help deploy your app to Netlify using the Netlify CLI

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== LinkedIn JS Tips Poster - Netlify Deployment ===${NC}"

# Step 1: Check if Netlify CLI is installed
echo -e "\n${YELLOW}Checking for Netlify CLI...${NC}"
if ! command -v netlify &> /dev/null; then
    echo "Netlify CLI not found. Installing globally..."
    npm install -g netlify-cli
else
    echo "Netlify CLI already installed."
fi

# Step 2: Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm run install-deps

# Step 3: Build the application
echo -e "\n${YELLOW}Building the application...${NC}"
npm run build

# Step 4: Deploy to Netlify
echo -e "\n${YELLOW}Deploying to Netlify...${NC}"
echo "You'll need to authenticate with Netlify if you haven't already."
echo "Choose 'Create & configure a new site' when prompted."

cd frontend
netlify deploy --dir=build --prod

# Step 5: Provide instructions
echo -e "\n${GREEN}=== Next Steps ===${NC}"
echo -e "1. Your site is now deployed to Netlify!"
echo -e "2. ${YELLOW}Important:${NC} Update your LinkedIn Developer App settings with the new Netlify URL"
echo -e "   Go to: https://www.linkedin.com/developers/apps"
echo -e "   Add this redirect URL: https://YOUR-NETLIFY-URL/auth/linkedin/callback"
echo -e "3. Go to your Netlify dashboard and add these environment variables:"
echo -e "   - REACT_APP_LINKEDIN_CLIENT_ID=your_linkedin_client_id"
echo -e "   - REACT_APP_NETLIFY_URL=https://YOUR-NETLIFY-URL (without trailing slash)"
echo -e "4. Trigger a new deploy after setting environment variables"

echo -e "\n${GREEN}Deployment complete!${NC}"
