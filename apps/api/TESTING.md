# Testing Guide for CRM API

## Overview

This project uses **Vitest** for unit and integration testing. Vitest is a blazing-fast testing framework built on Vite with full TypeScript support.

## Test Statistics

✅ **26 tests passing** across 2 test suites:
- **Repository Layer**: 11 tests
- **Service Layer**: 15 tests

## Test Commands

```bash
# Run tests once
pnpm test:run

# Run tests in watch mode (auto-rerun on file changes)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run tests with UI (interactive browser interface)
pnpm test:ui

# Default test command (watch mode)
pnpm test
```

## Test Structure

```
apps/api/
├── vitest.config.ts           # Vitest configuration
├── src/
│   ├── test/
│   │   ├── setup.ts          # Global test setup
│   │   └── helpers/
│   │       └── prisma-mock.ts # Prisma client mocking utilities
│   ├── repositories/
│   │   ├── customer.repository.ts
│   │   └── customer.repository.test.ts  # Repository tests
│   └── services/
│       ├── customer.service.ts
│       └── customer.service.test.ts      # Service tests
```

## Writing Tests

### Test File Naming Convention

- Test files: `*.test.ts` or `*.spec.ts`
- Placed alongside the code they test
- Example: `customer.service.ts` → `customer.service.test.ts`

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("FeatureName", () => {
  beforeEach(() => {
    // Setup before each test
  });

  describe("methodName", () => {
    it("should do something expected", () => {
      // Arrange
      const input = "test";

      // Act
      const result = someFunction(input);

      // Assert
      expect(result).toBe("expected");
    });
  });
});
```

## Testing Layers

### 1. Repository Layer Tests

**Purpose**: Test data access logic with mocked Prisma client

**Example**: `customer.repository.test.ts`

```typescript
import { createMockPrismaClient } from "../test/helpers/prisma-mock";

describe("CustomerRepository", () => {
  let repository: CustomerRepository;
  let mockPrisma: PrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();
    repository = new CustomerRepository(mockPrisma);
  });

  it("should find all customers", async () => {
    vi.mocked(mockPrisma.customer.findMany).mockResolvedValue(mockCustomers);
    
    const result = await repository.findAll();
    
    expect(result).toEqual(mockCustomers);
  });
});
```

**Coverage**:
- ✅ findAll() - Returns all customers ordered by createdAt
- ✅ findById() - Returns customer or null
- ✅ findByEmail() - Returns customer by email or null
- ✅ create() - Creates new customer
- ✅ update() - Updates existing customer
- ✅ delete() - Deletes customer
- ✅ count() - Returns total count

### 2. Service Layer Tests

**Purpose**: Test business logic with mocked repository

**Example**: `customer.service.test.ts`

```typescript
describe("CustomerService", () => {
  let service: CustomerService;
  let mockRepository: ICustomerRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      // ... other methods
    };
    service = new CustomerService(mockRepository);
  });

  it("should create customer with valid data", async () => {
    vi.mocked(mockRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(mockRepository.create).mockResolvedValue(createdCustomer);
    
    const result = await service.createCustomer(validInput);
    
    expect(result).toEqual(createdCustomer);
  });
});
```

**Coverage**:
- ✅ getAllCustomers() - Returns all customers
- ✅ getCustomerById() - Returns customer or throws error
- ✅ createCustomer() - Creates with validation
- ✅ createCustomer() - Prevents duplicate emails
- ✅ createCustomer() - Validates email format
- ✅ createCustomer() - Validates required fields
- ✅ updateCustomer() - Updates existing customer
- ✅ updateCustomer() - Checks customer exists
- ✅ updateCustomer() - Prevents duplicate emails on update
- ✅ updateCustomer() - Allows same email
- ✅ deleteCustomer() - Deletes existing customer
- ✅ deleteCustomer() - Checks customer exists
- ✅ getCustomerCount() - Returns count

### 3. Controller Layer Tests (TODO)

**Purpose**: Test HTTP request/response handling

```typescript
// Example structure (not yet implemented)
describe("CustomerController", () => {
  it("should return 200 with all customers", async () => {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await controller.getAllCustomers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});
```

## Mocking

### Prisma Client Mock

Use the helper function to create a mock Prisma client:

```typescript
import { createMockPrismaClient } from "../test/helpers/prisma-mock";

const mockPrisma = createMockPrismaClient();
```

### Vitest Mocking

```typescript
// Mock a function
const mockFn = vi.fn();
mockFn.mockResolvedValue("result");

// Mock a module
vi.mock("./module", () => ({
  default: vi.fn(),
  namedExport: vi.fn(),
}));

// Spy on a method
const spy = vi.spyOn(object, "method");
```

## Coverage

Run tests with coverage:

```bash
pnpm test:coverage
```

Coverage reports are generated in:
- Console output (text)
- `coverage/index.html` (HTML report)
- `coverage/coverage-final.json` (JSON data)

**Current Coverage Targets**:
- Repository Layer: 100%
- Service Layer: 100%
- Controller Layer: 0% (TODO)
- Overall: ~66%

**Excluded from Coverage**:
- `node_modules/`
- `dist/`
- `src/generated/` (Prisma client)
- Test files (`*.test.ts`, `*.spec.ts`)
- Config files (`vitest.config.ts`)
- Prisma migrations

## Best Practices

### 1. **Arrange-Act-Assert (AAA) Pattern**
```typescript
it("should create customer", async () => {
  // Arrange: Set up test data and mocks
  const input = { firstName: "John", ... };
  vi.mocked(repository.create).mockResolvedValue(customer);

  // Act: Execute the function under test
  const result = await service.createCustomer(input);

  // Assert: Verify the results
  expect(result).toEqual(customer);
});
```

### 2. **Test One Thing Per Test**
```typescript
// ❌ Bad: Testing multiple things
it("should create and update customer", async () => {
  const created = await service.createCustomer(input);
  const updated = await service.updateCustomer(created.id, update);
  // ...
});

// ✅ Good: Separate tests
it("should create customer", async () => { ... });
it("should update customer", async () => { ... });
```

### 3. **Use Descriptive Test Names**
```typescript
// ❌ Bad
it("test 1", () => { ... });

// ✅ Good
it("should throw error when customer not found", () => { ... });
```

### 4. **Mock External Dependencies**
- Always mock Prisma client in unit tests
- Mock repository in service tests
- Mock service in controller tests

### 5. **Test Edge Cases**
- Empty results
- Null/undefined values
- Validation errors
- Duplicate data
- Not found scenarios

### 6. **Clean Up After Tests**
```typescript
beforeEach(() => {
  // Setup
});

afterEach(() => {
  // Cleanup
  vi.clearAllMocks();
});
```

## Test-Driven Development (TDD)

### TDD Workflow

1. **🔴 Red**: Write a failing test
2. **🟢 Green**: Write minimal code to make it pass
3. **🔵 Refactor**: Improve the code while keeping tests green

### Example TDD Flow

```typescript
// 1. RED: Write failing test
it("should validate email format", async () => {
  await expect(service.createCustomer({ email: "invalid" }))
    .rejects.toThrow(ZodError);
});

// 2. GREEN: Implement validation
const validatedData = createCustomerSchema.parse(input);

// 3. REFACTOR: Clean up code
// Add better error messages, extract validation, etc.
```

## Vitest Configuration

**`vitest.config.ts`** highlights:

```typescript
{
  test: {
    environment: "node",        // Node.js environment
    globals: true,              // Global test APIs
    coverage: {
      provider: "v8",           // Fast coverage
      reporter: ["text", "html"],
    },
    testTimeout: 10000,         // 10s timeout
    clearMocks: true,           // Auto-clear mocks
  }
}
```

## Continuous Integration (CI)

Add to your CI pipeline:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: pnpm test:run

- name: Generate Coverage
  run: pnpm test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Debugging Tests

### VSCode Launch Configuration

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "pnpm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Debug Single Test

```typescript
// Add .only to run just this test
it.only("should debug this test", () => {
  // Set breakpoints here
});
```

## Next Steps

- [ ] Add Controller layer tests
- [ ] Add integration tests with real database (test DB)
- [ ] Add E2E tests with Playwright
- [ ] Increase coverage to 90%+
- [ ] Add test fixtures for common data
- [ ] Add performance tests
- [ ] Add API contract tests

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vitest API Reference](https://vitest.dev/api/)
- [Testing Best Practices](https://testingjavascript.com/)

---

**Last Updated**: November 8, 2024  
**Test Framework**: Vitest 4.0.8  
**Current Tests**: 26 passing

