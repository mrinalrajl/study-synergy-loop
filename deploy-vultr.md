# Vultr Deployment Guide

This guide will help you deploy the backend server to Vultr.

## 1. Sign Up for Vultr

1. Go to [Vultr.com](https://www.vultr.com/) and create an account
2. Add a payment method to your account

## 2. Deploy a New Server

1. From the Vultr dashboard, click "Products" → "Cloud Compute"
2. Choose a server location close to your target audience
3. Select OS: Ubuntu 22.04 LTS
4. Choose a plan (start with $5-10/month for testing)
5. Add SSH keys for secure access (recommended)
6. Click "Deploy Now"

## 3. Connect to Your Server

Once the server is provisioned, you'll receive an IP address. Connect to your server using SSH:

```bash
ssh root@YOUR_SERVER_IP
```

## 4. Set Up the Server Environment

```bash
# Update packages
apt update && apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Install Git
apt install -y git
```

## 5. Deploy Your Backend Code

```bash
# Clone your repository
git clone https://github.com/mrinalrajl/study-synergy-loop.git
cd study-synergy-loop

# Install dependencies
npm install

# Create a .env file
nano .env
```

Add your environment variables to the .env file:
```
GROQ_API_KEY=your_groq_api_key
PORT=4001
NODE_ENV=production
FRONTEND_URL=https://your-app-name.netlify.app
```

```bash
# Build the server
npm run build:server

# Start the server with PM2
pm2 start dist/server/groqProxy.js

# Configure PM2 to start on boot
pm2 startup
pm2 save
```

## 6. Set Up Nginx as a Reverse Proxy

```bash
# Install Nginx
apt install -y nginx

# Configure Nginx
nano /etc/nginx/sites-available/groqproxy
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-server-domain.com;  # Replace with your domain or IP

    location / {
        proxy_pass http://localhost:4001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site and restart Nginx
ln -s /etc/nginx/sites-available/groqproxy /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## 7. Set Up SSL with Let's Encrypt (if you have a domain)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
certbot --nginx -d your-server-domain.com
```

## 8. Update Your Frontend Configuration

After deploying your backend, make sure to update your Netlify environment variables with the correct backend URL.