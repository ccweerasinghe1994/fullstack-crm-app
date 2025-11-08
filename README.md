# Full-Stack CRM Application

A monorepo built with pnpm workspaces for managing customer accounts with full CRUD operations.

## Project Structure

```
frenchCompanyInterview/
├── apps/              # Applications (frontend, backend)
│   ├── web/          # React frontend application
│   └── api/          # Node.js/Express backend application
├── packages/          # Shared packages and libraries
│   ├── shared/       # Shared types, utilities, constants
│   └── ui/           # Shared UI components (if needed)
├── pnpm-workspace.yaml
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.11.0)
- PostgreSQL

### Installation

```bash
pnpm install
```

### Development

Run all apps in development mode:
```bash
pnpm dev
```

Run specific app:
```bash
pnpm --filter web dev
pnpm --filter api dev
```

### Building

Build all apps:
```bash
pnpm build
```

### Testing

Run unit tests:
```bash
pnpm test
```

Run e2e tests:
```bash
pnpm test:e2e
```

## Workspace Packages

### Apps
- `apps/web` - React frontend application
- `apps/api` - Express backend API

### Packages
- `packages/shared` - Shared types, utilities, and constants
- Additional packages will be added as needed

