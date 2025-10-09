# DevGourmet Deployment Guide

## Overview

This guide walks you through deploying the full-stack DevGourmet application (React frontend + Bun backend) to your VPS using Docker Compose and Caddy as a reverse proxy.

---

## Prerequisites

- VPS with Docker and Docker Compose installed
- SSH access to your VPS
- Domain: `devgourmet.com` pointing to your VPS IP
- Existing Caddy setup on `caddy_net` network

---

## Architecture

```
Internet → Caddy (Port 80/443)
            ↓
            ├─→ devgourmet_web:5173 (Frontend - React + Vite)
            └─→ devgourmet_server:3000 (Backend - Bun + Hono)
```

---

## Step 1: Prepare Your Local Environment

### 1.1 Build Production Assets

```bash
# From your local project root
cd /Users/blackbox/IdeaProjects/devgourmet.com

# Build both frontend and backend
bun run build
```

### 1.2 Verify Builds

```bash
# Check frontend build
ls -la apps/web/dist/

# Check backend build
ls -la apps/server/dist/
```

---

## Step 2: Create Deployment Files

### 2.1 Create Backend Dockerfile

Create `apps/server/Dockerfile`:

```dockerfile
FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN cd apps/server && bun install --production

# Copy server source
COPY apps/server ./apps/server

# Copy shared types
COPY packages/shared ./packages/shared

# Expose port
EXPOSE 3000

# Set working directory to server
WORKDIR /app/apps/server

# Start the server
CMD ["bun", "run", "src/index.ts"]
```

### 2.2 Create Frontend Dockerfile

Create `apps/web/Dockerfile.production`:

```dockerfile
FROM nginx:alpine

# Copy built files to nginx html directory
COPY dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2.3 Create Nginx Configuration

Create `apps/web/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 2.4 Create Root docker-compose.yml

Create `docker-compose.production.yml` in project root:

```yaml
version: "3.8"

services:
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile.production
    container_name: devgourmet_web
    restart: unless-stopped
    environment:
      - VITE_API_URL=https://devgourmet.com
    networks:
      - caddy_net
      - internal
    expose:
      - "80"
    depends_on:
      - server

  server:
    build:
      context: .
      dockerfile: apps/server/Dockerfile
    container_name: devgourmet_server
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=file:./data/devgourmet.db
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - BETTER_AUTH_URL=https://devgourmet.com
      - FRONTEND_URL=https://devgourmet.com
    volumes:
      # Persist database
      - ./data:/app/apps/server/data
    networks:
      - caddy_net
      - internal
    expose:
      - "3000"

networks:
  caddy_net:
    external: true
  internal:
    driver: bridge
```

### 2.5 Create .env.production

Create `.env.production` in project root:

```bash
# Generate a secure secret (run this command):
# openssl rand -base64 32

BETTER_AUTH_SECRET=your-super-secret-key-here-change-this
```

---

## Step 3: Update Caddy Configuration

SSH into your VPS and update Caddyfile:

```bash
ssh blackbox@vmi786438.contaboserver.net
cd ~/www/caddy
nano Caddyfile
```

Update the devgourmet.com block:

```caddyfile
devgourmet.com {
    # Frontend (React app)
    reverse_proxy devgourmet_web:80

    # Backend API (Bun server)
    handle /api/* {
        reverse_proxy devgourmet_server:3000
    }
}
```

Reload Caddy:

```bash
docker exec caddy caddy reload --config /etc/caddy/Caddyfile
```

---

## Step 4: Deploy to VPS

### 4.1 Create Deployment Directory

```bash
# On VPS
cd ~/www
rm -rf devgourmet.com  # Remove old static version
mkdir -p devgourmet.com
cd devgourmet.com
```

### 4.2 Automated Deployment with deploy.sh

The project includes an automated deployment script that handles everything for you.

**First-time setup only:**

```bash
# On your LOCAL machine
cd /Users/blackbox/IdeaProjects/devgourmet.com

# Ensure SSH alias is configured (if not already done)
# Edit ~/.ssh/config and add:
# Host contabo
#   HostName vmi786438.contaboserver.net
#   User blackbox
#   IdentityFile ~/.ssh/id_rsa

# Generate BETTER_AUTH_SECRET
openssl rand -base64 32

# Update .env.production with the generated secret
nano .env.production
```

**Deploy:**

```bash
# From your LOCAL machine
cd /Users/blackbox/IdeaProjects/devgourmet.com

# Run the deployment script
./deploy.sh
```

The script will automatically:
- ✅ Build your project (`bun run build`)
- ✅ Sync files to server using `rsync` (much faster than tar)
- ✅ Backup existing database (if it exists)
- ✅ Build Docker images on the server
- ✅ Restart containers with zero-downtime
- ✅ Verify deployment success
- ✅ Show recent logs

**What gets protected:**
- Database file (`data/devgourmet.db`) - never overwritten
- Environment file (`.env.production`) - only copied if it doesn't exist
- Automatic backups created before each deployment

### 4.3 Manual Deployment (Alternative)

If you prefer manual control or the script doesn't work:

```bash
# From your LOCAL machine
cd /Users/blackbox/IdeaProjects/devgourmet.com

# Build project
bun run build

# Sync files with rsync
rsync -avz --delete --exclude 'node_modules' --exclude 'data' \
  apps/web/dist/ \
  apps/web/Dockerfile.production \
  apps/web/nginx.conf \
  contabo:~/www/devgourmet.com/apps/web/

rsync -avz --delete --exclude 'node_modules' --exclude 'data' \
  apps/server/src/ \
  apps/server/package.json \
  apps/server/Dockerfile \
  contabo:~/www/devgourmet.com/apps/server/

rsync -avz --delete --exclude 'node_modules' \
  packages/shared/ \
  contabo:~/www/devgourmet.com/packages/shared/

rsync -avz \
  package.json \
  bun.lockb \
  docker-compose.production.yml \
  contabo:~/www/devgourmet.com/

# SSH into VPS and restart
ssh contabo
cd ~/www/devgourmet.com
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d
```

---

## Step 5: Initialize Database

The database will be automatically created on first run. To verify:

```bash
# Check if database file exists
ls -la ~/www/devgourmet.com/data/

# You should see: devgourmet.db

# Check server logs for successful startup
docker logs devgourmet_server

# You should see:
# 🚀 Server starting on http://localhost:3000
# 📝 tRPC endpoint: http://localhost:3000/api/trpc
# 🔐 Auth endpoint: http://localhost:3000/api/auth
```

---

## Step 6: Verify Deployment

### 6.1 Check Services

```bash
# Check running containers
docker ps | grep devgourmet

# Should show:
# devgourmet_web
# devgourmet_server

# Check networks
docker network inspect caddy_net | grep devgourmet
```

### 6.2 Test Endpoints

```bash
# Test backend health
curl http://localhost:3000/health

# Should return: {"status":"ok","timestamp":"..."}

# Test from outside
curl https://devgourmet.com/api/health
```

### 6.3 Test Frontend

Visit https://devgourmet.com in your browser and verify:
- ✅ Page loads
- ✅ Demo recipes work
- ✅ Can create account
- ✅ Can sign in
- ✅ Can create/save recipes

---

## Step 7: Monitoring and Maintenance

### 7.1 View Logs

```bash
# Frontend logs
docker logs devgourmet_web -f

# Backend logs
docker logs devgourmet_server -f

# Both services
docker-compose -f docker-compose.production.yml logs -f
```

### 7.2 Restart Services

```bash
cd ~/www/devgourmet.com

# Restart all
docker-compose -f docker-compose.production.yml restart

# Restart specific service
docker-compose -f docker-compose.production.yml restart web
docker-compose -f docker-compose.production.yml restart server
```

### 7.3 Update Deployment

**Automated (Recommended):**

```bash
# From LOCAL machine
cd /Users/blackbox/IdeaProjects/devgourmet.com
./deploy.sh
```

That's it! The script handles everything including database backups.

**Manual (if needed):**

```bash
# From LOCAL machine - build new version
cd /Users/blackbox/IdeaProjects/devgourmet.com
bun run build

# Sync with rsync (much faster than tar)
rsync -avz --delete --exclude 'node_modules' --exclude 'data' \
  apps/ contabo:~/www/devgourmet.com/apps/

# SSH and restart
ssh contabo
cd ~/www/devgourmet.com
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d
```

---

## Step 8: Backup Database

### 8.1 Manual Backup

```bash
cd ~/www/devgourmet.com

# Create backup
cp data/devgourmet.db data/devgourmet.db.backup.$(date +%Y%m%d_%H%M%S)

# Create backups directory
mkdir -p backups

# Copy to backups
cp data/devgourmet.db backups/devgourmet.db.$(date +%Y%m%d_%H%M%S)
```

### 8.2 Automated Backup (Optional)

Create `backup.sh`:

```bash
#!/bin/bash
cd ~/www/devgourmet.com
mkdir -p backups
cp data/devgourmet.db backups/devgourmet.db.$(date +%Y%m%d_%H%M%S)

# Keep only last 7 days of backups
find backups/ -name "devgourmet.db.*" -mtime +7 -delete
```

Add to crontab:

```bash
crontab -e

# Add line (daily at 2 AM):
0 2 * * * /home/blackbox/www/devgourmet.com/backup.sh
```

---

## Troubleshooting

### Issue: Frontend can't connect to backend

**Solution:**
```bash
# Check if server is running
docker logs devgourmet_server

# Check if both are on caddy_net
docker network inspect caddy_net

# Verify VITE_API_URL is correct in docker-compose.production.yml
```

### Issue: Database not persisting

**Solution:**
```bash
# Check volume mount
docker inspect devgourmet_server | grep -A 5 Mounts

# Ensure data directory exists and has correct permissions
ls -la ~/www/devgourmet.com/data/
chmod 755 ~/www/devgourmet.com/data
```

### Issue: CORS errors

**Solution:**
```bash
# Check server logs for CORS configuration
docker logs devgourmet_server

# Verify FRONTEND_URL matches your domain
docker exec devgourmet_server env | grep FRONTEND_URL
```

### Issue: SSL/HTTPS issues

**Solution:**
```bash
# Check Caddy logs
docker logs caddy

# Reload Caddy configuration
docker exec caddy caddy reload --config /etc/caddy/Caddyfile
```

---

## Security Checklist

- ✅ Change BETTER_AUTH_SECRET from default
- ✅ Database file has restricted permissions (chmod 644)
- ✅ Use HTTPS only (enforced by Caddy)
- ✅ Keep Bun and dependencies updated
- ✅ Regular database backups
- ✅ Monitor logs for suspicious activity

---

## Performance Optimization

### Enable HTTP/2 in Caddy

Caddy enables HTTP/2 by default with automatic HTTPS.

### Database Optimization

```bash
# Compact database periodically
docker exec -it devgourmet_server bun run db:migrate
```

---

## Quick Reference Commands

```bash
# Start services
cd ~/www/devgourmet.com && docker-compose -f docker-compose.production.yml up -d

# Stop services
cd ~/www/devgourmet.com && docker-compose -f docker-compose.production.yml down

# View logs
docker logs -f devgourmet_server
docker logs -f devgourmet_web

# Restart services
docker-compose -f docker-compose.production.yml restart

# Check status
docker ps | grep devgourmet

# Backup database
cp ~/www/devgourmet.com/data/devgourmet.db ~/www/devgourmet.com/backups/backup-$(date +%Y%m%d).db
```

---

## Success Indicators

After deployment, you should see:

1. **Containers running:**
   ```
   devgourmet_web      running
   devgourmet_server   running
   ```

2. **Server logs showing:**
   ```
   🚀 Server starting on http://localhost:3000
   📝 tRPC endpoint: http://localhost:3000/api/trpc
   🔐 Auth endpoint: http://localhost:3000/api/auth
   ```

3. **Frontend accessible at:** `https://devgourmet.com`

4. **Backend API responding at:** `https://devgourmet.com/api/health`

5. **Database file created:** `~/www/devgourmet.com/data/devgourmet.db`

---

## Support

If you encounter issues:

1. Check logs: `docker logs devgourmet_server` and `docker logs devgourmet_web`
2. Verify environment variables: `docker exec devgourmet_server env`
3. Test backend directly: `curl http://localhost:3000/health`
4. Check Caddy configuration: `docker exec caddy cat /etc/caddy/Caddyfile`

**Your deployment is complete! 🎉**
