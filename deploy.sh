#!/bin/bash
echo "🚀 Starting deployment..."

# Pull latest changes
echo "⬇️  Pulling latest code..."
git pull

# Rebuild the image manually ensures the latest code is used
echo "🏗️  Building image..."
# Load environment variables if .env exists
if [ -f .env ]; then
  echo "🔌 Loading environment variables..."
  export $(grep -v '^#' .env | xargs)
fi

# Rebuild the image using direct docker build to GUARANTEE args are passed
echo "🏗️  Building image (no cache)..."
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --no-cache \
  -t trainer-app .

# Deploy using Docker Swarm (fixes network permission issue)
echo "🚀 Deploying stack..."
docker stack deploy -c docker-compose.yml trainer-app

# Prune unused images to save space
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment complete! Check status with: docker service ls"
