# CRM Application - Project Structure

## Monorepo Structure

```
frenchCompanyInterview/
├── apps/                           # Application packages
│   ├── api/                        # Backend API (@crm/api)
│   │   ├── src/
│   │   │   └── index.ts           # Express server entry point
│   │   ├── package.json           # API dependencies
│   │   ├── tsconfig.json          # TypeScript configuration
│   │   └── .cursorrules           # API-specific rules
│   │
│   └── web/                        # Frontend App (@crm/web)
│       ├── src/
│       │   ├── components/        # React components
│       │   ├── routes/            # TanStack Router routes
│       │   ├── lib/               # Utilities
│       │   ├── integrations/      # Third-party integrations
│       │   ├── main.tsx           # App entry point
│       │   └── styles.css         # Global styles
│       ├── package.json           # Web dependencies
│       ├── tsconfig.json          # TypeScript configuration
│       ├── vite.config.ts         # Vite configuration
│       ├── biome.json             # Biome linter/formatter config
│       └── .cursorrules           # Frontend-specific rules
│
├── packages/                       # Shared packages
│   └── shared/                     # Shared utilities (@crm/shared)
│       ├── src/
│       │   ├── types/             # TypeScript types
│       │   ├── validators/        # Zod schemas
│       │   │   └── customer.validator.ts
│       │   ├── constants/         # Constants and enums
│       │   └── index.ts           # Main exports
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md
│
├── .cursor/
│   └── rules/
│       └── crm-rules.mdc          # Main project rules
│
├── scripts/
│   ├── dev-setup.sh               # Development setup (Unix)
│   └── dev-setup.ps1              # Development setup (Windows)
│
├── docker-compose.yml              # Docker services configuration
├── .dockerignore                   # Docker ignore rules
├── .env.example                    # Environment variables template
├── pnpm-workspace.yaml             # Workspace configuration
├── package.json                    # Root package.json
├── .gitignore                      # Git ignore rules
├── README.md                       # Main documentation
├── DOCKER.md                       # Docker setup guide
└── PROJECT_STRUCTURE.md            # This file

```

## Package Dependencies

### @crm/web (Frontend)
- **Depends on:**
  - `@crm/shared` - For types, validators, constants
- **Port:** 5173
- **Tech:** React 19, Vite, TanStack Router, TanStack Query, Tailwind CSS 4, shadcn/ui

### @crm/api (Backend)
- **Depends on:**
  - `@crm/shared` - For types, validators, constants
- **Port:** 3000
- **Tech:** Express, TypeScript, Prisma (planned), PostgreSQL

### @crm/shared (Shared Utilities)
- **Dependencies:** Zod
- **Provides:** Types, validators, constants
- **Used by:** @crm/web, @crm/api

## Adding shadcn/ui Components

All shadcn/ui components are in `apps/web/src/components/ui/`:

```bash
# From apps/web directory
cd apps/web
pnpx shadcn@latest add button card input form dialog table

# Or from project root
pnpx shadcn@latest add button --cwd apps/web
```

### Available Component Commands

```bash
# Common components
pnpx shadcn@latest add button --cwd apps/web
pnpx shadcn@latest add card --cwd apps/web
pnpx shadcn@latest add input --cwd apps/web
pnpx shadcn@latest add form --cwd apps/web
pnpx shadcn@latest add dialog --cwd apps/web
pnpx shadcn@latest add table --cwd apps/web
pnpx shadcn@latest add sheet --cwd apps/web
pnpx shadcn@latest add select --cwd apps/web
pnpx shadcn@latest add dropdown-menu --cwd apps/web
pnpx shadcn@latest add toast --cwd apps/web
pnpx shadcn@latest add alert --cwd apps/web
pnpx shadcn@latest add badge --cwd apps/web
```

## Usage Examples

### Importing Components

```tsx
// In apps/web/src/components/MyComponent.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MyComponent() {
  return (
    <Card className={cn("p-4", "bg-white")}>
      <Button>Click Me</Button>
    </Card>
  );
}
```

### Using Shared Validators

```typescript
// In apps/api/src/controllers/customer.controller.ts
import { customerSchema, CreateCustomerInput } from "@crm/shared/validators";

// Validate request body
const result = customerSchema.safeParse(req.body);
```

### Using Shared Constants

```typescript
// In apps/web/src/lib/api.ts
import { API_ENDPOINTS } from "@crm/shared/constants";

const response = await fetch(API_ENDPOINTS.CUSTOMERS);
```

## Development Workflow

### Start Development Servers

```bash
# Start both apps
pnpm dev

# Start only frontend
pnpm dev:web

# Start only backend
pnpm dev:api
```

### Build All Packages

```bash
pnpm build
```

### Type Checking

```bash
pnpm type-check
```

### Testing

```bash
# Unit tests
pnpm test

# E2E tests (planned)
pnpm test:e2e
```

## Tech Stack Summary

### Frontend (@crm/web)
- React 19.2.0
- TypeScript 5.7.2
- Vite 7.1.7
- TanStack Router 1.132.0
- TanStack Query 5.66.5
- Tailwind CSS 4.0.6
- Biome 2.2.4

### Backend (@crm/api)
- Express 5.1.0 (latest)
- TypeScript 5.7.2
- Prisma (planned)
- PostgreSQL (planned)

### Shared Packages
- **@crm/shared**: Zod 4.1.12 (latest), TypeScript types

## Docker Services

The project includes Docker Compose for local development:

### Services
- **PostgreSQL 16**: Database server (Port: 5432)
- **pgAdmin 4**: Database management UI (Port: 5050)

### Quick Start

```bash
# Start services
pnpm docker:up

# View logs
pnpm docker:logs

# Stop services
pnpm docker:down

# Reset (remove volumes)
pnpm docker:reset
```

### Automated Setup Scripts

**Unix/macOS/Linux:**
```bash
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh
```

**Windows PowerShell:**
```powershell
.\scripts\dev-setup.ps1
```

For detailed Docker documentation, see [DOCKER.md](DOCKER.md)

## Next Steps

1. ✅ Set up monorepo structure
2. ✅ Create shared packages (@crm/shared)
3. ✅ Configure shadcn/ui in apps/web
4. ✅ Set up Docker for PostgreSQL
5. ✅ Set up Prisma ORM
6. ✅ Implement Customer data model
7. ✅ Run initial migration
8. ✅ Seed database with sample data
9. ✅ Create Customer Repository (3-layer architecture)
10. ✅ Create Customer Service (business logic)
11. ✅ Create Customer Controller (API endpoints)
12. ✅ Implement full CRUD operations with /api prefix
13. ✅ Add error handling middleware
14. 🔲 Write unit tests (TDD)
15. 🔲 Build frontend UI and forms
16. 🔲 Add E2E tests with Playwright
17. 🔲 Documentation and deployment

