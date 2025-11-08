# CRM Backend API

Express 5 backend API for the CRM application.

## Tech Stack

- **Express 5.1.0** - Fast, unopinionated web framework
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Zod 4.1.12** - Schema validation (latest)
- **dotenv 17.2.3** - Environment variables
- **Vitest 4.0.8** - Unit testing
- **Prisma** (planned) - Database ORM
- **PostgreSQL** (planned) - Database

## Setup

Install dependencies:
```bash
pnpm install
```

## Development

Run in development mode:
```bash
pnpm dev
```

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

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /` - Root endpoint with API information

