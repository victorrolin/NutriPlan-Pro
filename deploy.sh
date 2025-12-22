#!/bin/bash
echo "🚀 Starting deployment..."

# Pull latest changes
echo "⬇️  Pulling latest code..."
git pull

# Rebuild the image manually ensures the latest code is used
echo "🏗️  Building image..."
docker build -t trainer-app .

# Deploy using Docker Swarm (fixes network permission issue)
echo "🚀 Deploying stack..."
docker stack deploy -c docker-compose.yml trainer-app

# Prune unused images to save space
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment complete! Check status with: docker service ls"
