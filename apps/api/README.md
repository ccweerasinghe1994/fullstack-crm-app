# CRM Backend API

Express 5 backend API for the CRM application.

## Tech Stack

- **Express 5.1.0** - Fast, unopinionated web framework
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Zod 4.1.12** - Schema validation (latest)
- **dotenv 17.2.3** - Environment variables
- **Vitest 4.0.8** - Unit testing
- **Prisma 6.19.0** - Database ORM
- **PostgreSQL 18** - Database (via Docker)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

Create `.env` file in `apps/api/`:

```env
DATABASE_URL=postgresql://crm_user:crm_password@localhost:5432/crm_db
PORT=3000
NODE_ENV=development
```

### 3. Start Docker database

```bash
# From project root
pnpm docker:up
```

### 4. Generate Prisma Client

```bash
pnpm prisma:generate
```

### 5. Run database migrations

```bash
pnpm prisma:migrate
# When prompted, enter migration name: "init_customer_model"
```

### 6. (Optional) Seed database

```bash
pnpm prisma:seed
```

## Development

Run in development mode:
```bash
pnpm dev
```

### Prisma Commands

```bash
# Generate Prisma Client
pnpm prisma:generate

# Create and apply migration
pnpm prisma:migrate

# Open Prisma Studio (GUI)
pnpm prisma:studio

# Seed database
pnpm prisma:seed
```

See [PRISMA_SETUP.md](./PRISMA_SETUP.md) for detailed Prisma documentation.

## Build

Build for production:
```bash
pnpm build
```

## Run Production Build

```bash
pnpm start
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/crm_db
```

## Testing

This project uses **Vitest** for testing with **96.96% code coverage**.

**Test Commands:**

```bash
# Run tests once
pnpm test:run

# Watch mode (auto-rerun on changes)
pnpm test:watch

# With coverage report
pnpm test:coverage

# Interactive UI
pnpm test:ui
```

**Test Results:**
- ✅ **26 tests passing**
- ✅ **96.96% code coverage**
- Repository Layer: 100% coverage
- Service Layer: 100% coverage

See [TESTING.md](./TESTING.md) for detailed testing guide.

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /` - Root endpoint with API information

