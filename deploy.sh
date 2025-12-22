#!/bin/bash
echo "🚀 Starting deployment..."

# Pull latest changes
echo "⬇️  Pulling latest code..."
git pull

# Rebuild and restart containers
echo "🏗️  Building and starting containers..."
docker-compose up -d --build

# Prune unused images to save space
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment complete!"
