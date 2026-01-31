#!/bin/bash

echo "🚀 Deploying to Cloudflare Pages..."
cd digital-health-cartoon/frontend

# Build with _redirects
npm run build
echo "/*    /index.html   200" > dist/_redirects

# Deploy
npx wrangler pages deploy dist --project-name=mosi-second-job2 --commit-dirty=true

echo "✅ Deployed to https://mosi-second-job2.pages.dev"