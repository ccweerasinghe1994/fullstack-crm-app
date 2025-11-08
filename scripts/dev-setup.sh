#!/bin/bash

# CRM Application - Development Setup Script
# This script sets up the local development environment

set -e

echo "🚀 Setting up CRM Application Development Environment..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env file created"
    else
        echo "⚠️  .env.example not found. Please create .env manually."
    fi
else
    echo "✅ .env file already exists"
fi

# Start Docker services
echo ""
echo "🐳 Starting Docker services (PostgreSQL + pgAdmin)..."
docker-compose up -d

# Wait for PostgreSQL to be healthy
echo ""
echo "⏳ Waiting for PostgreSQL to be ready..."
timeout=60
elapsed=0
while [ $elapsed -lt $timeout ]; do
    if docker-compose exec -T postgres pg_isready -U crm_user -d crm_db > /dev/null 2>&1; then
        echo "✅ PostgreSQL is ready!"
        break
    fi
    sleep 2
    elapsed=$((elapsed + 2))
    echo "   Waiting... (${elapsed}s/${timeout}s)"
done

if [ $elapsed -ge $timeout ]; then
    echo "❌ PostgreSQL failed to start within ${timeout} seconds"
    exit 1
fi

# Display service information
echo ""
echo "✅ Development environment is ready!"
echo ""
echo "📊 Services:"
echo "   - PostgreSQL:  localhost:5432"
echo "   - pgAdmin:     http://localhost:5050"
echo "   - Backend:     http://localhost:3000 (run 'pnpm dev:api')"
echo "   - Frontend:    http://localhost:5173 (run 'pnpm dev:web')"
echo ""
echo "🔑 Database Credentials:"
echo "   - User:        crm_user"
echo "   - Password:    crm_password"
echo "   - Database:    crm_db"
echo ""
echo "🔑 pgAdmin Credentials:"
echo "   - Email:       admin@crm.local"
echo "   - Password:    admin"
echo ""
echo "📝 Next steps:"
echo "   1. Install dependencies:  pnpm install"
echo "   2. Run migrations:        cd apps/api && pnpm prisma migrate dev"
echo "   3. Start dev servers:     pnpm dev"
echo ""
echo "📖 For more information, see DOCKER.md"

