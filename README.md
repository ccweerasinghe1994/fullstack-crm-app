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
- Docker & Docker Compose (for local database)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd frenchCompanyInterview
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

4. **Start Docker services** (PostgreSQL + pgAdmin)

```bash
docker-compose up -d
```

5. **Verify services are running**

```bash
docker-compose ps
```

### Development

**Start all services:**

```bash
# 1. Start Docker services (database)
docker-compose up -d

# 2. Run migrations (once Prisma is set up)
cd apps/api
pnpm prisma migrate dev
cd ../..

# 3. Start development servers
pnpm dev
```

**Run specific app:**

```bash
pnpm dev:api  # Backend only (http://localhost:3000)
pnpm dev:web  # Frontend only (http://localhost:5173)
```

**Access services:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432
- pgAdmin: http://localhost:5050

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

