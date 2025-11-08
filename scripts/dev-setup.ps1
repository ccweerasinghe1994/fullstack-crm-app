# CRM Application - Development Setup Script (PowerShell)
# This script sets up the local development environment

$ErrorActionPreference = "Stop"

Write-Host "🚀 Setting up CRM Application Development Environment..." -ForegroundColor Green
Write-Host ""

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file from .env.example..." -ForegroundColor Yellow
    if (Test-Path .env.example) {
        Copy-Item .env.example .env
        Write-Host "✅ .env file created" -ForegroundColor Green
    } else {
        Write-Host "⚠️  .env.example not found. Please create .env manually." -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Start Docker services
Write-Host ""
Write-Host "🐳 Starting Docker services (PostgreSQL + pgAdmin)..." -ForegroundColor Cyan
docker-compose up -d

# Wait for PostgreSQL to be healthy
Write-Host ""
Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
$timeout = 60
$elapsed = 0
$ready = $false

while ($elapsed -lt $timeout) {
    try {
        docker-compose exec -T postgres pg_isready -U crm_user -d crm_db 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ PostgreSQL is ready!" -ForegroundColor Green
            $ready = $true
            break
        }
    } catch {
        # Continue waiting
    }
    Start-Sleep -Seconds 2
    $elapsed += 2
    Write-Host "   Waiting... ($elapsed`s/$timeout`s)" -ForegroundColor Gray
}

if (-not $ready) {
    Write-Host "❌ PostgreSQL failed to start within $timeout seconds" -ForegroundColor Red
    exit 1
}

# Display service information
Write-Host ""
Write-Host "✅ Development environment is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Services:" -ForegroundColor Cyan
Write-Host "   - PostgreSQL:  localhost:5432"
Write-Host "   - pgAdmin:     http://localhost:5050"
Write-Host "   - Backend:     http://localhost:3000 (run 'pnpm dev:api')"
Write-Host "   - Frontend:    http://localhost:5173 (run 'pnpm dev:web')"
Write-Host ""
Write-Host "🔑 Database Credentials:" -ForegroundColor Yellow
Write-Host "   - User:        crm_user"
Write-Host "   - Password:    crm_password"
Write-Host "   - Database:    crm_db"
Write-Host ""
Write-Host "🔑 pgAdmin Credentials:" -ForegroundColor Yellow
Write-Host "   - Email:       admin@crm.local"
Write-Host "   - Password:    admin"
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Magenta
Write-Host "   1. Install dependencies:  pnpm install"
Write-Host "   2. Run migrations:        cd apps/api && pnpm prisma migrate dev"
Write-Host "   3. Start dev servers:     pnpm dev"
Write-Host ""
Write-Host "📖 For more information, see DOCKER.md" -ForegroundColor Gray

