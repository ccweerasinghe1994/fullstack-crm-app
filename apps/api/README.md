# CRM Backend API

Express.js backend API for the CRM application.

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

