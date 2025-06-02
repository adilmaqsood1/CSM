#!/bin/bash

# This script helps deploy your Django application to Vercel

echo "Deploying to Vercel..."

# Make sure you have the Vercel CLI installed
# npm install -g vercel

# Login to Vercel if not already logged in
# vercel login

# Deploy to Vercel
vercel --prod

echo "Deployment complete!"