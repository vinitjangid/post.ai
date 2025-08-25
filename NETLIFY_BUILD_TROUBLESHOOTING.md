# Netlify Build Troubleshooting Guide

If you're encountering the error `Failed during stage 'building site': Build script returned non-zero exit code: 2` on Netlify, follow these troubleshooting steps:

## Common Issues and Solutions

### 1. Missing Environment Variables

**Problem:** Your build may be failing because Netlify doesn't have the required environment variables.

**Solution:** Set the required environment variables in the Netlify dashboard:
- Go to Site settings > Build & deploy > Environment
- Add the following variables:
  ```
  REACT_APP_LINKEDIN_CLIENT_ID=your_linkedin_client_id
  REACT_APP_NETLIFY_URL=https://your-netlify-site.netlify.app
  ```

### 2. Node.js Version

**Problem:** Netlify might be using a different Node.js version than your local environment.

**Solution:** Specify a Node.js version in the Netlify dashboard:
- Go to Site settings > Build & deploy > Environment
- Add environment variable:
  ```
  NODE_VERSION=16.14.0
  ```

### 3. Build Command Issues

**Problem:** The build command in your `netlify.toml` might be incorrect.

**Solution:** Update your build command in the Netlify UI:
- Go to Site settings > Build & deploy > Build settings
- Set the build command to:
  ```
  cd frontend && npm install && npm run build
  ```

### 4. Dependency Issues

**Problem:** There might be conflicts between dependencies.

**Solution:** Try adding an `.npmrc` file (we've added one in the frontend directory):
```
legacy-peer-deps=true
engine-strict=false
```

### 5. Check Build Logs Carefully

**Problem:** The specific error might be buried in the build logs.

**Solution:** Look through the complete build log in the Netlify dashboard:
- Go to the Deploys section
- Click on the failed deploy
- Review the full log output
- Look for specific error messages related to modules, imports, or syntax errors

### 6. Local Debug

Run the included debug script to test the build locally:
```bash
chmod +x debug-build.sh
./debug-build.sh
```

If the local build works but Netlify fails, it's likely an environment-specific issue.

### 7. Cache Issues

**Problem:** Netlify might be caching problematic dependencies.

**Solution:** Clear the Netlify cache:
- Go to Site settings > Build & deploy > Build settings
- Click "Clear cache and deploy site"

### 8. Missing Data Files

**Problem:** The build might fail because it can't find data files.

**Solution:** Ensure all required JSON files are in the correct location:
- `/frontend/src/data/javascriptTips.json`
- `/frontend/src/data/reactTips.json`
- `/frontend/src/data/mcqQuestions.json`

### Contact Netlify Support

If you've tried all these steps and still have issues, contact Netlify support with your site name and build logs.
