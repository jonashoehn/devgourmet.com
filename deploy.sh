#!/usr/bin/env bash
set -e

# === Configuration ===
SSH_ALIAS="contabo"  # SSH alias from ~/.ssh/config
REMOTE_PATH="~/www/devgourmet.com"
WEB_SERVICE_NAME="devgourmetcom-web" # Name of your web service image (e.g., from your compose file)
SERVER_SERVICE_NAME="devgourmetcom-server" # Name of your server service image (e.g., from your compose file)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# === Functions ===
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# === Pre-flight Checks ===
log_info "Starting deployment to $SSH_ALIAS..."

# Check if we can connect to remote
if ! ssh -o ConnectTimeout=5 "$SSH_ALIAS" "echo 'Connection test'" > /dev/null 2>&1; then
    log_error "Cannot connect to $SSH_ALIAS. Check your SSH config."
    exit 1
fi
log_success "SSH connection verified"

# === Local Project Setup & Build ===
log_info "Ensuring local dependencies are consistent and building project..."

# 1. Update Bun lockfile locally (CRITICAL for --frozen-lockfile)
log_info "Running 'bun install' locally to update bun.lockb..."
if bun install; then
    log_success "Local 'bun install' completed. Lockfile is up-to-date."
    # Recommend committing changes, but script won't enforce it for deployment.
    # It's highly recommended to `git add bun.lockb && git commit` after this!
else
    log_error "Local 'bun install' failed. Please fix local dependency issues."
    exit 1
fi

# 2. Build the web frontend (assuming `bun run build` handles `apps/web` output to `dist`)
log_info "Building web frontend..."
if bun run build; then
    log_success "Web frontend build completed."
else
    log_error "Web frontend build failed. Check your build script."
    exit 1
fi

# === Deploy Files ===
log_info "Syncing project files to server..."

# Create deployment directory structure on remote if it doesn't exist
log_info "Creating remote directory structure if it doesn't exist..."
ssh "$SSH_ALIAS" "mkdir -p $REMOTE_PATH/{apps/web/dist,apps/server/src,packages/shared,data}"
log_success "Remote directory structure ensured."

# Sync root files including package.json, lockfile, and docker-compose
log_info "Syncing root project files..."
rsync -avz \
  ./package.json \
  ./docker-compose.production.yml \
  "$SSH_ALIAS:$REMOTE_PATH/"

# Sync lockfile (either bun.lock or bun.lockb, whichever exists)
if [ -f "bun.lock" ]; then
  log_info "Syncing bun.lock..."
  rsync -avz ./bun.lock "$SSH_ALIAS:$REMOTE_PATH/"
fi
if [ -f "bun.lockb" ]; then
  log_info "Syncing bun.lockb..."
  rsync -avz ./bun.lockb "$SSH_ALIAS:$REMOTE_PATH/"
fi

# Sync web application files
log_info "Syncing web application (dist, Dockerfile, nginx.conf)..."
rsync -avz --delete \
  ./apps/web/dist/ "$SSH_ALIAS:$REMOTE_PATH/apps/web/dist/"
rsync -avz \
  ./apps/web/Dockerfile \
  ./apps/web/nginx.conf \
  "$SSH_ALIAS:$REMOTE_PATH/apps/web/"

# Sync server application files (Dockerfile, package.json, drizzle.config.ts, and src)
log_info "Syncing server application (Dockerfile, package.json, drizzle, and src)..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude 'data' \
  --exclude '.env' \
  ./apps/server/src/ "$SSH_ALIAS:$REMOTE_PATH/apps/server/src/"
rsync -avz \
  ./apps/server/package.json \
  ./apps/server/Dockerfile \
  ./apps/server/drizzle.config.ts \
  "$SSH_ALIAS:$REMOTE_PATH/apps/server/"

# Sync shared package files
log_info "Syncing shared package..."
rsync -avz --delete \
  --exclude 'node_modules' \
  ./packages/shared/ "$SSH_ALIAS:$REMOTE_PATH/packages/shared/"

# Sync .env.production only if it doesn't exist on remote (preserve secrets)
log_info "Checking for remote .env.production..."
if ssh "$SSH_ALIAS" "[ ! -f $REMOTE_PATH/.env.production ]"; then
    log_warning "No .env.production found on server. Copying template..."
    rsync -avz ./.env.production "$SSH_ALIAS:$REMOTE_PATH/.env.production"
    log_warning "Please ensure $REMOTE_PATH/.env.production contains your actual secrets!"
else
    log_success ".env.production already exists on server (not overwriting)"
fi

log_success "File sync completed."

# === Database Protection ===
log_info "Checking database on remote server..."
ssh "$SSH_ALIAS" << 'ENDSSH'
set -e # Ensure inner script exits on error
cd ~/www/devgourmet.com

# Ensure data directory exists
mkdir -p data

# Check if database exists
if [ -f "data/devgourmet.db" ]; then
    echo "✓ Database exists, creating backup..."
    cp data/devgourmet.db data/devgourmet.db.backup.$(date +%Y%m%d_%H%M%S)

    # Keep only last 5 backups
    ls -t data/devgourmet.db.backup.* 2>/dev/null | tail -n +5 | xargs rm -f 2>/dev/null || true

    echo "✓ Database backup created."
else
    echo "ℹ No database found - will be created on first run."
fi
ENDSSH
log_success "Database check and backup completed."

# === Deploy and Restart Docker Containers ===
log_info "Building and restarting Docker containers on $SSH_ALIAS..."
ssh "$SSH_ALIAS" << 'ENDSSH'
set -e # Ensure inner script exits on error
cd ~/www/devgourmet.com

echo "ℹ Building Docker images with docker compose build..."
# Use --no-cache to ensure a fresh build and prevent stale layers
# For production, you might remove --no-cache once confident, but it's good for debugging
sudo docker compose -f docker-compose.production.yml build --no-cache

echo "ℹ Stopping old containers..."
sudo docker compose -f docker-compose.production.yml down

echo "ℹ Starting new containers..."
sudo docker compose -f docker-compose.production.yml up -d

echo "ℹ Containers restarted."
sleep 5 # Give containers a moment to start up

echo "ℹ Current container status:"
sudo docker compose -f docker-compose.production.yml ps
ENDSSH

log_success "Docker containers built and restarted."

# === Verify Deployment ===
log_info "Verifying deployment..."
sleep 5 # Give services more time to become healthy

# Check if web and server containers are running and healthy
if ssh "$SSH_ALIAS" "sudo docker compose -f $REMOTE_PATH/docker-compose.production.yml ps --services --filter 'status=running' | grep -q $WEB_SERVICE_NAME && sudo docker compose -f $REMOTE_PATH/docker-compose.production.yml ps --services --filter 'status=running' | grep -q $SERVER_SERVICE_NAME"; then
    log_success "Containers are running and healthy."
else
    log_error "Container verification failed. One or more containers are not running or healthy."
    log_error "Check logs with: ssh $SSH_ALIAS 'docker logs $SERVER_SERVICE_NAME' and 'docker logs $WEB_SERVICE_NAME'"
    exit 1
fi

# === Show Logs ===
log_info "Recent server logs (last 20 lines):"
ssh "$SSH_ALIAS" "docker logs --tail 20 $SERVER_SERVICE_NAME"

echo ""
log_success "Deployment completed successfully! 🎉"
log_info "Visit: https://devgourmet.com"
log_info "View logs (live): ssh $SSH_ALIAS 'docker logs -f $SERVER_SERVICE_NAME'"