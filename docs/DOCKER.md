# Docker Setup Guide

This document explains how to use Docker for both development and production deployment of the CRM application.

## Services Included

- **PostgreSQL 18** - Main database (Port: 5432)
- **pgAdmin 4** - Database management UI (Port: 5050)
- **API** - Node.js/Express backend (Port: 3000)
- **Web** - React frontend served by nginx (Port: 5173)

## Prerequisites

- Docker Desktop installed

## Quick Start

### Production Mode (Default)

Runs the full stack with optimized production builds.

```bash
# Build all services
pnpm docker:build

# Start all services
pnpm docker:up

# View logs
pnpm docker:logs

# Check service status
pnpm docker:ps
```

Access the application:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api-docs
- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:5050

### Development Mode (Hot Reload)

Runs with source code mounted for hot-reloading.

```bash
# Start development mode
pnpm docker:dev

# Or rebuild and start
pnpm docker:dev:build
```

This mode:
- Mounts source code directories
- Enables hot-reloading for both API and Web
- Exposes debugger port (9229) for API
- Uses development environment variables

## Configuration

### Environment Variables

Create `.env` file in project root (optional - defaults provided):

```env
# Database
POSTGRES_USER=crm_user
POSTGRES_PASSWORD=crm_password
POSTGRES_DB=crm_db

# pgAdmin
PGADMIN_EMAIL=admin@crm.local
PGADMIN_PASSWORD=admin

# API (for production mode)
NODE_ENV=production
LOG_LEVEL=info

# Frontend
VITE_API_URL=http://localhost:3000
```

### API Configuration

The API uses different connection strings based on mode:

**Inside Docker containers** (production):
```env
DATABASE_URL=postgresql://crm_user:crm_password@postgres:5432/crm_db
```

**From host machine** (local development):
```env
DATABASE_URL=postgresql://crm_user:crm_password@localhost:5432/crm_db
```

Example files:
- `apps/api/.env.docker.example` - Docker configuration
- `apps/api/.env.example` - Local development configuration

## pgAdmin Setup

After accessing pgAdmin at `http://localhost:5050`:

1. **Login** with your PGADMIN_EMAIL and PGADMIN_PASSWORD
2. **Add New Server**:
   - General Tab:
     - Name: `CRM Local`
   - Connection Tab:
     - Host: `postgres` (use container name, not localhost)
     - Port: `5432`
     - Maintenance database: `crm_db`
     - Username: `crm_user`
     - Password: `crm_password`
     - Save password: ✓

## Docker Commands

### Available NPM Scripts

```bash
# Build containers
pnpm docker:build

# Start all services (production)
pnpm docker:up

# Start development mode with hot reload
pnpm docker:dev
pnpm docker:dev:build  # with rebuild

# Stop all services
pnpm docker:down

# View logs
pnpm docker:logs          # all services
pnpm docker:logs:api      # API only
pnpm docker:logs:web      # Web only

# Service management
pnpm docker:ps            # list containers
pnpm docker:restart       # restart all
pnpm docker:restart:api   # restart API
pnpm docker:restart:web   # restart Web

# Cleanup
pnpm docker:clean         # remove containers and volumes
pnpm docker:reset         # clean, rebuild, and start
```

### Raw Docker Compose Commands

```bash
# Start services
docker-compose up -d                    # production
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up  # development

# Stop services
docker-compose stop

# View logs
docker-compose logs -f postgres
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f pgadmin

# Restart services
docker-compose restart api
docker-compose restart web
```

### Execute Commands in Containers

```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U crm_user -d crm_db

# Access bash in containers
docker-compose exec postgres sh
docker-compose exec api sh
docker-compose exec web sh

# Run Prisma commands in API container
docker-compose exec api pnpm prisma:migrate:deploy
docker-compose exec api pnpm prisma:generate
docker-compose exec api pnpm prisma:studio

# Run tests in API container
docker-compose exec api pnpm test:run
```

### Remove Services

```bash
# Stop and remove containers (keeps volumes)
docker-compose down

# Remove containers and volumes (DELETES ALL DATA!)
docker-compose down -v

# Remove everything including images
docker-compose down -v --rmi all
```

## Data Persistence

All data is persisted in Docker volumes:

- **postgres_data**: PostgreSQL database files
- **pgadmin_data**: pgAdmin configuration and saved servers

### Backup Data

```bash
# Backup database
docker-compose exec postgres pg_dump -U crm_user crm_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U crm_user -d crm_db < backup.sql
```

### List Volumes

```bash
docker volume ls | grep crm
```

### Inspect Volume

```bash
docker volume inspect crm_postgres_data
docker volume inspect crm_pgadmin_data
```

## Architecture Details

### Multi-Stage Builds

Both API and Web use optimized multi-stage Docker builds:

**API Dockerfile:**
1. **deps**: Install production dependencies only
2. **builder**: Build TypeScript, generate Prisma client, TSOA routes
3. **production**: Copy built assets, run as non-root user

**Web Dockerfile:**
1. **builder**: Build Vite application with optimizations
2. **production**: Serve with nginx, run as non-root user

### Service Dependencies

```
web → api → postgres
    ↓
 pgadmin → postgres
```

- Web waits for API health check
- API waits for PostgreSQL health check
- All services use the same Docker network for communication

### Health Checks

All services include health checks:
- **postgres**: `pg_isready` command
- **api**: HTTP GET to `/health` endpoint
- **web**: wget to nginx `/health` endpoint

### Networking

- **Bridge network**: `crm_network`
- **Internal communication**: Use service names (e.g., `http://api:3000`)
- **External access**: Use localhost (e.g., `http://localhost:3000`)

### Security

- Non-root users in all containers
- Minimal Alpine base images
- Production dependencies only in final images
- Environment-based configuration
- Health checks for orchestration

## Troubleshooting

### Port Already in Use

If ports 3000, 5173, 5432, or 5050 are in use:

**Option 1: Stop existing service**
```bash
# Windows - Stop PostgreSQL service
Stop-Service postgresql-x64-*

# macOS/Linux
sudo systemctl stop postgresql
```

**Option 2: Change ports in docker-compose.yml**
```yaml
postgres:
  ports:
    - '5433:5432'  # Use 5433 instead

api:
  ports:
    - '3001:3000'  # Use 3001 instead

web:
  ports:
    - '8080:80'    # Use 8080 instead

pgadmin:
  ports:
    - '5051:80'    # Use 5051 instead
```

### Container Won't Start

```bash
# Check logs for specific service
docker-compose logs api
docker-compose logs web
docker-compose logs postgres

# Rebuild specific service
docker-compose up -d --build api

# Remove and recreate all
docker-compose down
docker-compose up -d --build
```

### API Container Crashes

```bash
# View API logs
docker-compose logs api

# Common issues:
# 1. Database not ready - wait for postgres health check
# 2. Prisma client not generated - rebuild container
# 3. Environment variables missing - check .env file

# Fix: Rebuild API
docker-compose up -d --build api
```

### Web Container Shows 502 Gateway Error

```bash
# Check if API is healthy
docker-compose ps

# View web logs
docker-compose logs web

# Restart web service
docker-compose restart web
```

### Hot Reload Not Working in Dev Mode

```bash
# Ensure using development compose file
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Check volume mounts
docker-compose -f docker-compose.yml -f docker-compose.dev.yml config

# Restart with rebuild
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### Database Connection Refused

1. Wait for health check to pass:
   ```bash
   docker-compose ps
   # Wait until postgres shows "healthy"
   ```

2. Verify connection from host:
   ```bash
   docker-compose exec postgres pg_isready -U crm_user
   ```

### Reset Everything

```bash
# Stop and remove everything
pnpm docker:clean

# Or manually
docker-compose down -v --remove-orphans

# Remove volumes manually if needed
docker volume rm crm_postgres_data crm_pgadmin_data

# Start fresh
pnpm docker:reset
```

### Prisma Migrations Not Running

```bash
# Run migrations manually in API container
docker-compose exec api sh -c "cd /app/apps/api && pnpm prisma:migrate:deploy"

# Or generate client
docker-compose exec api sh -c "cd /app/apps/api && pnpm prisma:generate"

# Restart API after migrations
docker-compose restart api
```

## Production Considerations

⚠️ **This setup is for local development only!**

For production, consider:

1. **Security**:
   - Use strong passwords
   - Don't expose PostgreSQL port publicly
   - Use secrets management
   - Enable SSL/TLS

2. **Performance**:
   - Tune PostgreSQL configuration
   - Use connection pooling
   - Configure resource limits

3. **Backup**:
   - Automated backup strategy
   - Off-site backup storage
   - Regular backup testing

4. **Monitoring**:
   - Database monitoring tools
   - Log aggregation
   - Alerting setup

## Development Workflows

### Option 1: Full Docker Stack (Recommended for Testing)

Everything runs in containers:

```bash
# Start development mode with hot reload
pnpm docker:dev

# In another terminal, run migrations
docker-compose exec api sh -c "cd /app/apps/api && pnpm prisma:migrate:deploy"

# View logs
pnpm docker:logs
```

**Pros:**
- Closest to production environment
- All services containerized
- Easy to share with team
- No local Node.js required

**Cons:**
- Slower hot reload than native
- More resource intensive

### Option 2: Hybrid (Database in Docker, Apps Native)

Database in Docker, apps run natively:

```bash
# 1. Start only database services
docker-compose up -d postgres pgadmin

# 2. Run migrations
cd apps/api && pnpm prisma:migrate:dev && cd ../..

# 3. Start development servers natively
pnpm dev

# 4. Run tests natively
pnpm test
```

**Pros:**
- Fast hot reload
- Familiar development experience
- Easy debugging
- Lower resource usage

**Cons:**
- Requires local Node.js setup
- Environment differences from production

### Option 3: Full Production Build Testing

Test production builds locally:

```bash
# Build and start production containers
pnpm docker:build
pnpm docker:up

# Access application
open http://localhost:5173
```

**Use for:**
- Pre-deployment testing
- Performance testing
- Production build verification

## Environment Variables

All environment variables are defined in `.env` file:

| Variable            | Description            | Default                 |
| ------------------- | ---------------------- | ----------------------- |
| `POSTGRES_USER`     | PostgreSQL username    | `crm_user`              |
| `POSTGRES_PASSWORD` | PostgreSQL password    | `crm_password`          |
| `POSTGRES_DB`       | Database name          | `crm_db`                |
| `PGADMIN_EMAIL`     | pgAdmin login email    | `admin@crm.local`       |
| `PGADMIN_PASSWORD`  | pgAdmin login password | `admin`                 |
| `DATABASE_URL`      | Full connection string | Generated from above    |
| `NODE_ENV`          | Environment mode       | `production`            |
| `LOG_LEVEL`         | Winston log level      | `info`                  |
| `VITE_API_URL`      | API URL for frontend   | `http://localhost:3000` |

## Health Checks

PostgreSQL includes a health check that ensures:
- Database is ready to accept connections
- Database process is running
- User can authenticate

Status: `docker-compose ps` will show "healthy" when ready.

## Network Configuration

All services are connected via `crm_network` bridge network:
- Services can communicate using container names
- PostgreSQL is accessible as `postgres:5432` from other containers
- Host machine accesses via `localhost:5432`

## CI/CD Integration

### Building for Production

```bash
# Build optimized images
docker-compose build --no-cache

# Tag images for registry
docker tag crm-api:latest your-registry/crm-api:v1.0.0
docker tag crm-web:latest your-registry/crm-web:v1.0.0

# Push to registry
docker push your-registry/crm-api:v1.0.0
docker push your-registry/crm-web:v1.0.0
```

### Deployment

```bash
# Pull and deploy on server
docker-compose pull
docker-compose up -d

# Run migrations on deployment
docker-compose exec api pnpm prisma:migrate:deploy
```

## Performance Tips

1. **Layer Caching**: Keep `package.json` copying separate from source code
2. **Multi-stage Builds**: Used to minimize final image size
3. **Production Dependencies**: Only install what's needed for runtime
4. **Volume Mounts**: Development mode mounts source for hot reload
5. **Health Checks**: Prevent premature traffic routing

## Best Practices

✅ **Do:**
- Use `.dockerignore` to exclude unnecessary files
- Run containers as non-root users
- Use specific version tags (not `latest`)
- Implement health checks
- Use multi-stage builds
- Set resource limits in production

❌ **Don't:**
- Include `.env` files in images
- Run as root user
- Store secrets in images
- Use development dependencies in production
- Ignore security updates

---

**Last Updated**: November 9, 2025

