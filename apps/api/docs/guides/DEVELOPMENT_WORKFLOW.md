# Development Workflow - Backend API

## 🔄 Standard Development Cycle

### 1. Make Changes
Edit code in:
- `src/controllers/` - API endpoint handlers
- `src/services/` - Business logic
- `src/repositories/` - Data access layer
- `src/middleware/` - Express middleware
- `src/routes/` - Route definitions

### 2. Run Tests ⚠️ MANDATORY
```bash
pnpm test:run
```

**Expected Output:**
```
✓ src/repositories/customer.repository.test.ts (11 tests)
✓ src/services/customer.service.test.ts (15 tests)

Test Files  2 passed (2)
     Tests  26 passed (26)
  Duration  300-400ms
```

### 3. If Tests Fail
1. Review error messages
2. Fix the code or tests
3. Run `pnpm test:run` again
4. Repeat until all tests pass

### 4. Type Check (Optional but Recommended)
```bash
pnpm type-check
```

### 5. Build (Optional - for production verification)
```bash
pnpm build
```

## 📊 Test Commands

| Command              | Description              | When to Use                   |
| -------------------- | ------------------------ | ----------------------------- |
| `pnpm test:run`      | Run all tests once       | **After every change**        |
| `pnpm test:watch`    | Watch mode (auto-rerun)  | During active development     |
| `pnpm test:coverage` | Generate coverage report | Before commits, weekly checks |
| `pnpm test:ui`       | Interactive UI           | Debugging complex tests       |

## 🎯 Development Best Practices

### When Adding New Features

1. **Write test first** (TDD)
   ```typescript
   // customer.service.test.ts
   it("should create customer with valid data", async () => {
     // Test code
   });
   ```

2. **Implement feature**
   ```typescript
   // customer.service.ts
   async createCustomer(input: CreateCustomerInput) {
     // Implementation
   }
   ```

3. **Run tests**
   ```bash
   pnpm test:run
   ```

4. **Refactor if needed**
   - Clean up code
   - Optimize logic
   - Run tests again

### When Fixing Bugs

1. **Write failing test** that reproduces the bug
2. **Fix the code** to make test pass
3. **Run all tests** to ensure no regressions
4. **Add edge case tests** to prevent similar bugs

### When Refactoring

1. **Ensure tests are passing** before starting
2. **Make incremental changes**
3. **Run tests after each change**
4. **Verify no functionality broke**

## ⚡ Quick Commands

```bash
# Start development server
pnpm dev

# Run tests after changes
pnpm test:run

# Watch mode for active development
pnpm test:watch

# Check TypeScript types
pnpm type-check

# Generate Prisma client
pnpm prisma:generate

# Create migration
pnpm prisma:migrate

# Open Prisma Studio
pnpm prisma:studio
```

## 🚨 Common Issues

### Tests Failing After Changes

**Problem**: Tests break after modifying code

**Solution**:
1. Read error messages carefully
2. Update tests if API contract changed
3. Fix code if logic is wrong
4. Add new tests for new edge cases

### Slow Test Execution

**Problem**: Tests take too long

**Solution**:
- Tests should run in ~300-400ms
- If slower, check for:
  - Real database calls (should be mocked)
  - Network requests (should be mocked)
  - Unoptimized loops

### Mocks Not Working

**Problem**: Mocked functions still calling real code

**Solution**:
```typescript
// Always use vi.mocked() from vitest
vi.mocked(mockRepository.findById).mockResolvedValue(customer);
```

## 📈 Coverage Guidelines

**Current Coverage: 96.96%**

Maintain coverage by:
- Writing tests for all new features
- Testing edge cases (null, undefined, errors)
- Testing both success and failure paths
- Mocking external dependencies

**Target Coverage:**
- Overall: >95%
- New code: 100%
- Critical paths: 100%

## 🔍 Debugging Tests

### Run Single Test File
```bash
pnpm test src/services/customer.service.test.ts
```

### Run Tests Matching Pattern
```bash
pnpm test customer
```

### Debug with UI
```bash
pnpm test:ui
```
- Opens browser interface
- Visual test explorer
- Interactive debugging

### Add Breakpoints
```typescript
it("should debug this", () => {
  debugger; // Add breakpoint
  // Test code
});
```

## 📝 Commit Checklist

Before committing:

- [ ] All tests pass (`pnpm test:run`)
- [ ] TypeScript compiles (`pnpm type-check`)
- [ ] No console.logs or debuggers left
- [ ] Updated tests for new features
- [ ] Code follows project conventions
- [ ] Meaningful commit message

## 🎓 Learning Resources

- [Vitest Documentation](https://vitest.dev/)
- [TESTING.md](./TESTING.md) - Comprehensive testing guide
- [VITEST_QUICKSTART.md](./VITEST_QUICKSTART.md) - Quick reference
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference

---

**Remember**: Tests are not optional. They ensure code quality and prevent regressions. Always run `pnpm test:run` after making changes! ✅

