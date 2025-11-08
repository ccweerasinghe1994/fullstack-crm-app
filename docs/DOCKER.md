# Docker Development Setup

This document explains how to use Docker for local development of the CRM application.

## Services Included

- **PostgreSQL 18** - Main database (Port: 5432)
- **pgAdmin 4** - Database management UI (Port: 5050)

## Prerequisites

- Docker Desktop installed

## Quick Start

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your preferred credentials (optional - defaults are provided).

### 2. Start Services

```bash
# Start all services in detached mode
docker-compose up -d

# Or start with logs visible
docker-compose up
```

### 3. Verify Services

```bash
# Check running containers
docker-compose ps

# Check logs
docker-compose logs -f postgres
docker-compose logs -f pgadmin
```

### 4. Access Services

- **PostgreSQL**: `localhost:5432`
  - User: `crm_user` (or your POSTGRES_USER)
  - Password: `crm_password` (or your POSTGRES_PASSWORD)
  - Database: `crm_db` (or your POSTGRES_DB)

- **pgAdmin**: `http://localhost:5050`
  - Email: `admin@crm.local` (or your PGADMIN_EMAIL)
  - Password: `admin` (or your PGADMIN_PASSWORD)

## Database Connection Strings

### For Backend (apps/api/.env)

```env
DATABASE_URL=postgresql://crm_user:crm_password@localhost:5432/crm_db
```

### For Prisma (apps/api/.env)

```env
DATABASE_URL=postgresql://crm_user:crm_password@localhost:5432/crm_db
```

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

## Useful Commands

### Start Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d postgres
```

### Stop Services

```bash
# Stop all services
docker-compose stop

# Stop specific service
docker-compose stop postgres
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart postgres
```

### View Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f postgres
docker-compose logs -f pgadmin
```

### Execute Commands in Containers

```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U crm_user -d crm_db

# Access bash in postgres container
docker-compose exec postgres sh
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

## Troubleshooting

### Port Already in Use

If port 5432 or 5050 is already in use:

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

pgadmin:
  ports:
    - '5051:80'    # Use 5051 instead
```

### Container Won't Start

```bash
# Check logs
docker-compose logs postgres

# Remove and recreate
docker-compose down
docker-compose up -d
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
docker-compose down -v

# Remove volumes manually
docker volume rm crm_postgres_data crm_pgadmin_data

# Start fresh
docker-compose up -d
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

## Integration with Development Workflow

### 1. Start Docker Services

```bash
docker-compose up -d
```

### 2. Run Prisma Migrations

```bash
cd apps/api
pnpm prisma migrate dev
```

### 3. Start Development Servers

```bash
# From project root
pnpm dev
```

### 4. Run Tests

```bash
pnpm test
```

## Environment Variables

All environment variables are defined in `.env` file:

| Variable            | Description            | Default              |
| ------------------- | ---------------------- | -------------------- |
| `POSTGRES_USER`     | PostgreSQL username    | `crm_user`           |
| `POSTGRES_PASSWORD` | PostgreSQL password    | `crm_password`       |
| `POSTGRES_DB`       | Database name          | `crm_db`             |
| `PGADMIN_EMAIL`     | pgAdmin login email    | `admin@crm.local`    |
| `PGADMIN_PASSWORD`  | pgAdmin login password | `admin`              |
| `DATABASE_URL`      | Full connection string | Generated from above |

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

---

**Last Updated**: November 2024

