# Zod v4 Migration Guide

Upgraded from Zod v3.24.1 to v4.1.12

## Breaking Changes

Zod v4 includes several improvements and breaking changes. Here are the key ones to be aware of:

### 1. Stricter Type Inference
Zod v4 has improved type inference which may catch issues that v3 didn't.

### 2. Changes to `.parse()` Behavior
- More consistent error messages
- Better error formatting

### 3. Schema Composition
- Improved `.extend()`, `.merge()`, `.pick()`, and `.omit()` methods
- Better type inference for composed schemas

### 4. `.optional()` and `.nullable()` Changes
```typescript
// v3
const schema = z.string().optional().nullable();

// v4 - order may affect type inference differently
const schema = z.string().optional().nullable();
```

### 5. `.refine()` and `.superRefine()` Improvements
- Better error handling
- Improved type narrowing

## What We're Using

Our customer validation schema in `packages/shared/src/validators/customer.validator.ts`:

```typescript
import { z } from "zod";

export const customerSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  dateCreated: z.date().optional(),
});
```

## Testing Required

- ✅ Build passes without errors
- [ ] Test all validation schemas
- [ ] Verify error messages are still user-friendly
- [ ] Test API request validation
- [ ] Test form validation on frontend

## Benefits of Zod v4

1. **Better Performance**: Faster validation
2. **Improved Types**: Better TypeScript inference
3. **Enhanced Errors**: More helpful error messages
4. **Bug Fixes**: Various bug fixes from v3

## Resources

- [Zod v4 Release Notes](https://github.com/colinhacks/zod/releases)
- [Zod Documentation](https://zod.dev)

