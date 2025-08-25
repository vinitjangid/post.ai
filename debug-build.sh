#!/bin/bash

# Script to debug Netlify build issues locally
# This simulates the Netlify build environment as closely as possible

set -e  # Exit on error

echo "===== NETLIFY BUILD DEBUG SCRIPT ====="
echo "This script simulates the Netlify build environment"
echo

# Check Node.js and npm versions
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo

# Print environment info
echo "Environment: NODE_ENV=$NODE_ENV"
echo

# Clean any previous build
echo "Cleaning previous build..."
rm -rf frontend/build
echo

# Install dependencies
echo "Installing dependencies..."
cd frontend
npm install
echo

# Check for eslint errors
echo "Checking for linting errors..."
npm run build -- --profile
echo

# If we get here, build succeeded
echo
echo "===== BUILD SUCCESSFUL ====="
echo "If the build works locally but fails on Netlify, check:"
echo "1. Node.js version (set in Netlify UI)"
echo "2. Environment variables"
echo "3. Build command in netlify.toml"
echo "4. Package versions and dependencies"
