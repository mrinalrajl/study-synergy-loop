# Netlify Deployment Guide

This guide will help you deploy the frontend application to Netlify.

## 1. Sign Up for Netlify

1. Go to [Netlify.com](https://www.netlify.com/) and create an account
2. Connect your GitHub account

## 2. Prepare Your Frontend Code

Before deploying, make sure your frontend is configured to connect to your backend API:

1. Create a `.env.production` file in your project root:
   ```
   VITE_API_URL=https://your-vultr-server-ip-or-domain
   ```

2. Update your API calls in your frontend code to use this environment variable:
   ```typescript
   // Example API call
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';
   
   const response = await fetch(`${API_URL}/api/groq`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ prompt })
   });
   ```

## 3. Deploy to Netlify

### Option 1: Deploy via Netlify UI

1. Go to [app.netlify.com](https://app.netlify.com/)
2. Click "New site from Git"
3. Connect to your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

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

## 4. Configure Environment Variables

1. In Netlify dashboard, go to Site settings → Build & deploy → Environment
2. Add `VITE_API_URL` with your Vultr server URL

## 5. Set Up Custom Domain (Optional)

1. In Netlify dashboard, go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your domain's DNS settings

## 6. Test Your Deployment

1. Visit your Netlify site URL
2. Test the application features that call the Groq API
3. Check browser console for any CORS or connection errors

## Troubleshooting

- **CORS errors**: Make sure your backend CORS configuration includes your Netlify domain
- **API connection issues**: Verify your environment variables are set correctly
- **Build failures**: Check the Netlify deploy logs for errors