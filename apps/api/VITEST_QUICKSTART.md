# ⚡ Vitest Quick Start

## TL;DR

```bash
cd apps/api

# Run tests
pnpm test:run        # Run once
pnpm test:watch      # Watch mode
pnpm test:coverage   # With coverage
pnpm test:ui         # Interactive UI
```

## Current Status

✅ **26 tests passing**  
✅ **96.96% code coverage**  
⚡ **Fast execution** (~365ms)

## Test Files

```
src/
├── repositories/
│   └── customer.repository.test.ts  ✅ 11 tests (100% coverage)
└── services/
    └── customer.service.test.ts      ✅ 15 tests (100% coverage)
```

## Quick Examples

### Running Tests

```bash
# Watch mode (recommended for development)
pnpm test:watch

# Single run
pnpm test:run

# With coverage
pnpm test:coverage

# Open coverage report
start coverage/index.html  # Windows
open coverage/index.html   # macOS
```

### Writing a Test

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("MyService", () => {
  beforeEach(() => {
    // Setup
  });

  it("should do something", async () => {
    // Arrange
    const input = "test";
    
    // Act
    const result = await myFunction(input);
    
    // Assert
    expect(result).toBe("expected");
  });
});
```

### Mocking Prisma

```typescript
import { createMockPrismaClient } from "../test/helpers/prisma-mock";

const mockPrisma = createMockPrismaClient();
vi.mocked(mockPrisma.customer.findMany).mockResolvedValue([]);
```

## Configuration Files

- `vitest.config.ts` - Main configuration
- `src/test/setup.ts` - Global test setup
- `src/test/helpers/prisma-mock.ts` - Prisma mocking

## Documentation

- 📖 [TESTING.md](./TESTING.md) - Complete testing guide
- 📊 [VITEST_SETUP_SUMMARY.md](./VITEST_SETUP_SUMMARY.md) - Setup details
- 🔍 [Coverage Report](./coverage/index.html) - HTML coverage report

## What's Tested

### Repository Layer (100%)
- ✅ CRUD operations
- ✅ Edge cases (null, empty)
- ✅ All database queries

### Service Layer (100%)
- ✅ Business logic
- ✅ Validation (Zod)
- ✅ Error handling
- ✅ Duplicate checks

## Next Steps

1. Add controller tests
2. Add integration tests
3. Add E2E tests (Playwright)
4. Increase to 100% branch coverage

---

**Framework**: Vitest 4.0.8  
**Coverage**: 96.96%  
**Tests**: 26 passing

