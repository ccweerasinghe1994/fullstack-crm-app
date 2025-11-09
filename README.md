# Full-Stack CRM Application

A monorepo built with pnpm workspaces for managing customer accounts with full CRUD operations.

## Project Structure

```
frenchCompanyInterview/
├── apps/              # Applications (frontend, backend)
│   ├── web/          # React frontend application
│   └── api/          # Node.js/Express backend application
├── packages/          # Shared packages and libraries
│   └── shared/       # Shared types, utilities, constants
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

#### Option 1: Full Docker Stack (Recommended)

Run the entire application in Docker containers:

```bash
# Build and start all services (production mode)
pnpm docker:build
pnpm docker:up

# OR start development mode with hot reload
pnpm docker:dev
```

#### Option 2: Hybrid Mode (Database Only)

Run database in Docker, apps natively:

```bash
# 1. Start Docker services (database only)
docker-compose up -d postgres pgadmin

# 2. Run migrations
cd apps/api && pnpm prisma:migrate:dev && cd ../..

# 3. Start development servers
pnpm dev
```

**Run specific app:**

```bash
pnpm dev:api  # Backend only (http://localhost:3000)
pnpm dev:web  # Frontend only (http://localhost:5173)
```

**Access services:**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
  - Health check: http://localhost:3000/health
  - Customer API: http://localhost:3000/api/customers
  - Swagger UI: http://localhost:3000/api-docs
  - OpenAPI Spec: http://localhost:3000/swagger.json
  - **[API Documentation](apps/api/docs/)**
- **PostgreSQL**: localhost:5432 (User: `crm_user`, Password: `crm_password`, DB: `crm_db`)
- **pgAdmin**: http://localhost:5050 (Email: `admin@crm.local`, Password: `admin`)
- **Prisma Studio**: http://localhost:5555 (Run: `cd apps/api && pnpm prisma:studio`)

### Docker Commands

```bash
# Production mode
pnpm docker:build         # Build all containers
pnpm docker:up            # Start all services
pnpm docker:down          # Stop all services
pnpm docker:logs          # View logs

# Development mode (hot reload)
pnpm docker:dev           # Start with hot reload
pnpm docker:dev:build     # Rebuild and start

# Service management
pnpm docker:ps            # List containers
pnpm docker:restart:api   # Restart API
pnpm docker:restart:web   # Restart Web
pnpm docker:clean         # Remove containers & volumes
pnpm docker:reset         # Clean, rebuild, start
```

See **[Docker Setup Guide](docs/DOCKER.md)** for detailed information.

### Building

Build all apps:
```bash
pnpm build
```

### Testing

**Unit Tests:**
```bash
pnpm test                 # Run all unit tests
pnpm test:watch           # Watch mode
pnpm test:coverage        # With coverage report
```

**E2E Tests:**
```bash
pnpm test:e2e             # Run Playwright tests
pnpm test:e2e:ui          # Interactive UI mode
pnpm test:e2e:headed      # See browser
pnpm test:e2e:debug       # Debug mode
```

**Tests in Docker:**
```bash
docker-compose exec api pnpm test:run
```

## Workspace Packages

### Apps
- **`@crm/web`** (`apps/web`) - React frontend application (Port 5173)
- **`@crm/api`** (`apps/api`) - Express backend API (Port 3000)

### Packages
- **`@crm/shared`** (`packages/shared`) - Shared types, Zod validators, constants

## Package Dependencies

```
@crm/web (frontend)
└── @crm/shared (validators, types, constants)

@crm/api (backend)
└── @crm/shared (validators, types, constants)

@crm/shared (shared utilities)
└── (standalone, used by web and api)
```

## Adding shadcn/ui Components

Components are located in `apps/web/src/components/ui/`:

```bash
# From apps/web directory
cd apps/web
pnpx shadcn@latest add button card input form dialog table
```

Components will be added to `apps/web/src/components/ui/`

### Using Components and Shared Code

```tsx
// In apps/web
import { Button } from "@/components/ui/button";
import { customerSchema } from "@crm/shared/validators";
import { API_ENDPOINTS } from "@crm/shared/constants";
```

## ✨ Implemented Features

### Backend API (✅ Complete)

- ✅ **Full CRUD Operations** for Customer management
  - GET `/api/customers` - List all customers (paginated, searchable, sortable)
  - GET `/api/customers/:id` - Get customer by ID
  - POST `/api/customers` - Create new customer
  - PUT `/api/customers/:id` - Update customer
  - DELETE `/api/customers/:id` - Delete customer
  - GET `/api/customers/count` - Get customer count

- ✅ **3-Layer Architecture**
  - Repository Layer (data access)
  - Service Layer (business logic)
  - Controller Layer (HTTP handling)

- ✅ **Advanced Features**
  - Server-side pagination & sorting
  - Full-text search (PostgreSQL)
  - OpenAPI/Swagger documentation (TSOA)
  - Winston logging with rotation
  - Comprehensive error handling
  - Zod validation schemas

- ✅ **Database**
  - PostgreSQL 18 with Docker
  - Prisma ORM integration
  - Migrations and seeding
  - Type-safe queries
  - Full-text search indexes

- ✅ **Testing**
  - Unit tests (Vitest) - 26/26 passing
  - 96%+ code coverage
  - Repository, Service, Controller tests

### Frontend (✅ Complete)

- ✅ **Customer Management UI**
  - Advanced data table (TanStack Table)
  - Server-side pagination
  - Column sorting with indicators
  - Full-text search with debounce
  - Column visibility toggle
  - Create/Edit/Delete operations

- ✅ **UI/UX Features**
  - Responsive design (mobile-first)
  - Dark mode support
  - Loading states & skeletons
  - Toast notifications (Sonner)
  - Form validation (React Hook Form + Zod)
  - Accessible components (shadcn/ui)

- ✅ **State Management**
  - TanStack Query (caching, mutations)
  - TanStack Router (file-based)
  - Optimistic updates
  - Error boundaries

- ✅ **Testing**
  - Unit tests (Vitest)
  - E2E tests (Playwright) - Full CRUD workflows
  - Component tests

### DevOps (✅ Complete)

- ✅ **Dockerization**
  - Multi-stage builds for API & Web
  - Production-optimized images
  - Development mode with hot reload
  - Docker Compose orchestration
  - Health checks for all services
  - Non-root users for security

- ✅ **Development Tools**
  - PNPM monorepo
  - TypeScript strict mode
  - Biome (linting/formatting)
  - Git hooks (optional)
  - VS Code debugging config

### Documentation

- 📚 **Backend API**: [apps/api/docs/](apps/api/docs/) - Complete API documentation
  - [API Reference](apps/api/docs/api/API_DOCUMENTATION.md) - Endpoints and examples
  - [Implementation Summary](apps/api/docs/api/IMPLEMENTATION_SUMMARY.md) - Architecture details
  - [Setup Guides](apps/api/docs/setup/) - Prisma, TSOA, Vitest, Database
  - [Development Guides](apps/api/docs/guides/) - Workflow, Testing, Logging, Best Practices

- 📚 **Project Documentation**: [docs/](docs/)
  - [Docker Guide](docs/DOCKER.md) - **Full Docker setup (API + Web + DB)**
  - [Project Structure](docs/PROJECT_STRUCTURE.md) - Detailed project overview
  - [PRD & Tech Stack](docs/prd-prep.md) - Product requirements and tech decisions

## 🚀 Deployment

### Quick Deploy with Docker

```bash
# 1. Build production images
pnpm docker:build

# 2. Start all services
pnpm docker:up

# 3. Run database migrations
docker-compose exec api pnpm prisma:migrate:deploy

# 4. Verify deployment
curl http://localhost:3000/health
curl http://localhost:5173/health
```

### Image Registry (Optional)

```bash
# Tag images
docker tag crm-api:latest your-registry/crm-api:v1.0.0
docker tag crm-web:latest your-registry/crm-web:v1.0.0

# Push to registry
docker push your-registry/crm-api:v1.0.0
docker push your-registry/crm-web:v1.0.0
```

See [Docker Guide](docs/DOCKER.md) for production deployment details.

## 🎯 Project Status

**✅ COMPLETE** - All core requirements implemented:
- ✅ Full CRUD operations
- ✅ 3-layer architecture (Repository, Service, Controller)
- ✅ PostgreSQL with Prisma ORM
- ✅ Advanced features (search, pagination, sorting)
- ✅ Full Docker containerization
- ✅ Comprehensive testing (Unit + E2E)
- ✅ OpenAPI/Swagger documentation
- ✅ Production-ready logging
- ✅ Responsive UI with dark mode

**Bonus Features Implemented:**
- ✅ PostgreSQL full-text search
- ✅ API documentation (Swagger/OpenAPI)
- ✅ Full containerization with Docker
- ✅ Winston logging with rotation
- ✅ Advanced data table (TanStack Table)
- ✅ Dark mode support

