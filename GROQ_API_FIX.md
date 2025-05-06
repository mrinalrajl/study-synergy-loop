# Groq API Integration Fix for Netlify Deployment

## Problem

The application was encountering errors when trying to connect to the Groq API in the Netlify deployment environment. This was happening because:

1. The frontend was using relative URLs (`/api/groq`) which work in development with the Vite proxy but not in production
2. There was no serverless function in Netlify to handle the Groq API requests
3. The CORS configuration in the Groq proxy server had issues with the Netlify domain format

## Solution

The following changes were implemented to fix the issue:

### 1. API URL Configuration

- Updated `src/utils/api.ts` to use environment variables for the API URL with proper fallbacks for production
- Modified `src/lib/groqClient.ts` to use the API_BASE_URL from utils instead of hardcoded relative paths

### 2. Netlify Serverless Function

- Created a Netlify function at `netlify/functions/groq-proxy.js` to handle Groq API requests
- This function acts as a proxy between the frontend and the Groq API
- Added proper CORS headers to allow requests from the Netlify domain

### 3. Netlify Configuration

- Updated `netlify.toml` to include:
  - Functions directory configuration
  - Redirect rules to route `/api/groq` requests to the Netlify function

### 4. CORS Configuration

- Fixed the CORS configuration in `src/server/groqProxy.ts` to properly handle requests from the Netlify domain
- Removed the array syntax and trailing slash from the origin URL

### 5. Testing

- Added tests in `src/test/groqClient.test.ts` to verify the Groq API integration works correctly

## Deployment Instructions

Detailed deployment instructions are available in the `DEPLOYMENT.md` file. Key points:

1. Set the following environment variables in Netlify:
   - `GROQ_API_KEY`: Your Groq API key
   - `FRONTEND_URL`: Your Netlify site URL
   - `NODE_ENV`: Set to `production`

2. Deploy to Netlify using the UI or CLI as described in the deployment guide

3. Verify that the Groq API integration works by testing the chat feature

## Local Development

For local development:

1. Run the frontend:
   ```bash
   npm run dev
   ```

2. Run the Groq proxy server:
   ```bash
   npm run groq:server
   ```

The Vite development server will proxy API requests to the local Groq server.

## Troubleshooting

If you encounter issues with the Groq API integration:

1. Check that the environment variables are set correctly in Netlify
2. Verify that the Netlify function is deployed correctly
3. Check the browser console and Netlify function logs for errors
4. Ensure the CORS configuration allows requests from your Netlify domain