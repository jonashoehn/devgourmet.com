FROM oven/bun:1

WORKDIR /app

# Step 1: Copy only package.json files (NO LOCKFILE)
# This forces Bun to resolve dependencies fresh in the Docker environment
COPY package.json ./
COPY apps/server/package.json ./apps/server/
COPY packages/shared/package.json ./packages/shared/

# Step 2: Install workspace dependencies without frozen lockfile
# Since we didn't copy a lockfile, Bun will generate one fresh
# This avoids any local/production environment mismatches
RUN bun install --production

# Step 3: Copy all other application code after dependencies are installed.
# This layer will be invalidated if your source code changes, but the
# bun install layer will remain cached if dependencies haven't changed.
COPY apps/server ./apps/server
COPY packages/shared ./packages/shared

# Expose port for the server
EXPOSE 3000

# Set the final working directory to the server application
WORKDIR /app/apps/server

# Create data directory for SQLite database with proper permissions
RUN mkdir -p data && chmod 755 data

# Create startup script that initializes DB and starts server
RUN echo '#!/bin/sh\n\
echo "🔧 Initializing database..."\n\
bun run src/db/init.ts\n\
echo "🚀 Starting server..."\n\
exec bun run src/index.ts' > /app/start.sh && chmod +x /app/start.sh

# Command to start the server (with DB initialization)
CMD ["/app/start.sh"]