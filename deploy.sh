#!/usr/bin/env bash
set -e

# === Configuration ===
REMOTE_HOST="contabo"
REMOTE_PATH="~/www/devgourmet.com/app"

# === Deployment ===
echo "🚀 Starting deployment to $REMOTE_HOST..."

# Sync dist folder
echo "📦 Syncing build files..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.env' \
  ./dist/ "$REMOTE_HOST:$REMOTE_PATH/"

# Sync Dockerfile
echo "🐳 Syncing Dockerfile..."
rsync -avz ./Dockerfile "$REMOTE_HOST:$REMOTE_PATH/"

# Restart Docker Compose on remote host
echo "🔄 Restarting Docker Compose on server..."
ssh "$REMOTE_HOST" "cd $REMOTE_PATH && sudo docker compose build && sudo docker compose down && sudo docker compose up -d"

echo "✅ Deployment completed successfully!"
