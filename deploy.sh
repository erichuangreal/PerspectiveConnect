#!/bin/bash
set -e

echo "🚀 Deploying PerspectiveConnect..."

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "❌ Error: backend/.env not found!"
    echo "Please copy backend/.env.example to backend/.env and configure it"
    exit 1
fi

# Pull latest code
echo "📥 Pulling latest code..."
git pull

# Deploy with Docker Compose
echo "🐳 Building and starting services..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check services status
echo "✅ Checking services..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Services:"
echo "  Backend:  http://localhost:8000"
echo "  Frontend: http://localhost:3000"
echo ""
echo "To view logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
