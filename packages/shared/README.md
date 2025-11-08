# @crm/shared

Shared types, utilities, validation schemas, and constants for the CRM application.

## Installation

This package is part of the monorepo and is automatically linked via pnpm workspace.

## Usage

### Types

```typescript
import type { Customer } from "@crm/shared/types";
```

### Validators

```typescript
import { customerSchema, createCustomerSchema } from "@crm/shared/validators";

// Validate data
const result = customerSchema.safeParse(data);
```

### Constants

```typescript
import { API_ENDPOINTS } from "@crm/shared/constants";

const url = API_ENDPOINTS.CUSTOMERS;
```

## Structure

```
src/
├── types/         # TypeScript types and interfaces
├── validators/    # Zod validation schemas
├── constants/     # Shared constants and enums
└── index.ts       # Main exports
```

## Tech Stack

- TypeScript 5.7.2
- Zod 3.22.4 (validation)
- Vitest 3.0.5 (testing)

