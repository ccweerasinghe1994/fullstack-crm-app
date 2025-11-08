# Prisma Setup Guide

This document explains how to work with Prisma in the CRM API.

## Schema Overview

The Customer model includes all required fields:

```prisma
model Customer {
  id          String    @id @default(uuid())
  firstName   String    @map("first_name")
  lastName    String    @map("last_name")
  email       String    @unique
  phoneNumber String?   @map("phone_number")
  address     String?
  city        String?
  state       String?
  country     String?
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  @@map("customers")
  @@index([email])
  @@index([createdAt])
}
```

### Field Mappings

Prisma uses camelCase in TypeScript but snake_case in the database:
- `firstName` → `first_name`
- `lastName` → `last_name`
- `phoneNumber` → `phone_number`
- `createdAt` → `created_at`
- `updatedAt` → `updated_at`

### Indexes

- `email`: Unique index for fast lookups and uniqueness constraint
- `createdAt`: Index for sorting by creation date

## Initial Setup

### 1. Install Dependencies

```bash
cd apps/api
pnpm install
```

### 2. Set Environment Variables

Create `apps/api/.env`:

```env
DATABASE_URL=postgresql://crm_user:crm_password@localhost:5432/crm_db
PORT=3000
NODE_ENV=development
```

### 3. Start Docker Database

```bash
# From project root
pnpm docker:up

# Or
docker-compose up -d
```

### 4. Generate Prisma Client

```bash
cd apps/api
pnpm prisma:generate
```

This generates the Prisma Client in `src/generated/prisma/`.

### 5. Run Migrations

```bash
pnpm prisma:migrate
```

This will:
- Create migration files in `prisma/migrations/`
- Apply the migration to your database
- Regenerate the Prisma Client

### 6. Seed the Database (Optional)

```bash
pnpm prisma:seed
```

This adds sample customer data to the database.

## Development Workflow

### Making Schema Changes

1. **Update the schema**:
   ```bash
   # Edit apps/api/prisma/schema.prisma
   ```

2. **Create and apply migration**:
   ```bash
   pnpm prisma:migrate
   # Give your migration a descriptive name when prompted
   ```

3. **Generate Prisma Client** (usually done automatically):
   ```bash
   pnpm prisma:generate
   ```

### Using Prisma Client

Import from the generated location:

```typescript
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// Create
await prisma.customer.create({
  data: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  },
});

// Read
const customers = await prisma.customer.findMany();
const customer = await prisma.customer.findUnique({
  where: { email: "john@example.com" },
});

// Update
await prisma.customer.update({
  where: { id: "uuid-here" },
  data: { firstName: "Jane" },
});

// Delete
await prisma.customer.delete({
  where: { id: "uuid-here" },
});
```

## Useful Commands

### Generate Prisma Client

```bash
pnpm prisma:generate
```

### Create and Apply Migration

```bash
pnpm prisma:migrate
```

### Apply Migration (Production)

```bash
pnpm prisma:migrate:deploy
```

### Open Prisma Studio (GUI)

```bash
pnpm prisma:studio
```

Access at: http://localhost:5555

### Seed Database

```bash
pnpm prisma:seed
```

### Reset Database (Danger!)

```bash
cd apps/api
npx prisma migrate reset
```

This will:
- Drop the database
- Create a new database
- Run all migrations
- Run seed script

### View Database

```bash
pnpm prisma:studio
```

Or use pgAdmin at http://localhost:5050

## Prisma Studio

Prisma Studio is a visual database browser:

```bash
cd apps/api
pnpm prisma:studio
```

Opens at http://localhost:5555

Features:
- View all tables
- Add/edit/delete records
- Search and filter
- Visual relationships

## Migration Best Practices

1. **Development**:
   - Use `prisma migrate dev` for local development
   - Commit migration files to git
   - Write descriptive migration names

2. **Production**:
   - Use `prisma migrate deploy` in CI/CD
   - Never modify applied migrations
   - Test migrations on staging first

3. **Data Safety**:
   - Be careful with destructive changes (dropping columns/tables)
   - Use custom migration SQL for data transformations
   - Always backup before major migrations

## Custom Output Path

Our Prisma setup uses a custom output path:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}
```

This keeps generated files out of `node_modules` and under version control awareness.

### Import Path

Always import from the generated location:

```typescript
import { PrismaClient } from "../generated/prisma";
// NOT from "@prisma/client"
```

## TypeScript Types

Prisma automatically generates types:

```typescript
import type { Customer, Prisma } from "../generated/prisma";

// Model type
const customer: Customer = {
  id: "uuid",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phoneNumber: null,
  address: null,
  city: null,
  state: null,
  country: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Create input type
const createData: Prisma.CustomerCreateInput = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
};

// Update input type
const updateData: Prisma.CustomerUpdateInput = {
  firstName: "Jane",
};
```

## Repository Pattern

Our architecture uses the Repository Pattern. Database access should ONLY happen in repositories:

```typescript
// ❌ BAD - Direct Prisma in controller/service
async function getCustomers() {
  return await prisma.customer.findMany();
}

// ✅ GOOD - Repository layer
// src/repositories/customer.repository.ts
export class CustomerRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Customer[]> {
    return await this.prisma.customer.findMany();
  }
}
```

## Troubleshooting

### "Cannot find module '../generated/prisma'"

Run:
```bash
pnpm prisma:generate
```

### "Database connection refused"

1. Check Docker is running:
   ```bash
   docker-compose ps
   ```

2. Check DATABASE_URL in `.env`

3. Restart database:
   ```bash
   pnpm docker:reset
   ```

### "Migration failed"

1. Check database connection
2. Look at error message
3. Fix schema issue
4. Run migration again

### "Type errors after schema change"

Regenerate client:
```bash
pnpm prisma:generate
```

### "Can't connect to database in tests"

Use a separate test database or mock Prisma Client in tests.

## Next Steps

1. ✅ Schema created
2. ✅ Migrations set up
3. 🔲 Create Customer Repository
4. 🔲 Create Customer Service
5. 🔲 Create Customer Controller
6. 🔲 Write tests (TDD)

---

**See also:**
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

