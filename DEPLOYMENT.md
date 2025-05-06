# Deployment Guide

This guide explains how to deploy the application to Netlify with proper Groq API integration.

## Netlify Deployment

### 1. Set up Environment Variables

In your Netlify dashboard, go to Site settings → Build & deploy → Environment:

- `GROQ_API_KEY`: Your Groq API key
- `FRONTEND_URL`: Your Netlify site URL (e.g., https://your-app-name.netlify.app)
- `NODE_ENV`: Set to `production`

### 2. Deploy to Netlify

You can deploy to Netlify using one of these methods:

#### Option 1: Netlify UI

1. Go to [app.netlify.com](https://app.netlify.com/)
2. Click "New site from Git"
3. Connect to your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

#### Option 2: Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize and deploy your site:
   ```bash
   netlify init
   ```
   Follow the prompts to set up your project.

### 3. Verify Deployment

1. Once deployed, visit your Netlify site URL
2. Test the Groq API integration by using the chat feature
3. Check the browser console for any errors

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Verify that the `FRONTEND_URL` environment variable is set correctly in Netlify
2. Check that the URL doesn't have a trailing slash

### API Connection Issues

If the frontend can't connect to the Groq API:

1. Check that the `GROQ_API_KEY` is set correctly in Netlify
2. Verify that the Netlify function is deployed correctly by checking the Functions tab in your Netlify dashboard
3. Test the function directly by visiting `https://your-app-name.netlify.app/.netlify/functions/groq-proxy` (should return a 405 Method Not Allowed for GET requests)

### Function Execution Issues

If the Netlify function fails to execute:

1. Check the Function logs in your Netlify dashboard
2. Verify that the `groq-sdk` package is installed and included in your dependencies

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