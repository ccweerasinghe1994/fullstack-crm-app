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
- **`@crm/web`** (`apps/web`) - React frontend application (Port 5173)
- **`@crm/api`** (`apps/api`) - Express backend API (Port 3000)

### Packages
- **`@crm/shared`** (`packages/shared`) - Shared types, Zod validators, constants
- **`@crm/ui`** (`packages/ui`) - Shared shadcn/ui components and utilities

## Package Dependencies

```
@crm/web (frontend)
├── @crm/shared (validators, types, constants)
└── @crm/ui (UI components)

@crm/api (backend)
└── @crm/shared (validators, types, constants)

@crm/ui (UI package)
└── (standalone, used by web app)

@crm/shared (shared utilities)
└── (standalone, used by web and api)
```

## Adding shadcn/ui Components

Components are located in the shared `packages/ui` package:

```bash
# From packages/ui directory
cd packages/ui
pnpx shadcn@latest add button card input form dialog table

# Or from project root
pnpx shadcn@latest add button --cwd packages/ui
```

Components will be added to `packages/ui/src/components/ui/`

### Using Shared Components

```tsx
// In apps/web or any other app
import { Button } from "@crm/ui";
import { customerSchema } from "@crm/shared/validators";
import { API_ENDPOINTS } from "@crm/shared/constants";
```

