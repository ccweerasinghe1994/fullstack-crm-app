# E2E Tests

End-to-end tests for the CRM application using Playwright.

## Running Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run tests with UI mode (interactive)
pnpm test:e2e:ui

# Run tests in headed mode (see browser)
pnpm test:e2e:headed

# Debug tests (opens inspector)
pnpm test:e2e:debug

# Show test report
pnpm test:e2e:report
```

## Test Structure

- `fixtures/` - Page Object Models and test data generators
  - `page-objects.ts` - Page Object Model classes for UI components
  - `customer-fixtures.ts` - Test data generators using Faker
- `tests/` - Test specifications organized by feature
  - `customer-list.spec.ts` - List, search, sort, pagination tests
  - `customer-create.spec.ts` - Create customer workflow tests
  - `customer-edit.spec.ts` - Edit customer workflow tests
  - `customer-delete.spec.ts` - Delete customer workflow tests
  - `customer-full-crud.spec.ts` - Complete CRUD integration test

## Writing Tests

Use Page Object Model pattern for maintainability:

```typescript
import { CustomersPage } from '../fixtures/page-objects';

test('my test', async ({ page }) => {
  const customersPage = new CustomersPage(page);
  await customersPage.goto();
  // ... test logic
});
```

## Test Coverage

### Customer List Tests
- ✅ Display customer table
- ✅ Search functionality (1-2 char ILIKE + 3+ char full-text)
- ✅ Pagination controls
- ✅ Column sorting with visual indicators

### Create Customer Tests
- ✅ Create with all fields
- ✅ Validation for required fields

### Edit Customer Tests
- ✅ Update customer details
- ✅ Success toast notification

### Delete Customer Tests
- ✅ Delete with confirmation
- ✅ Cancel delete operation
- ✅ Verify deletion from table

### Full CRUD Integration Test
- ✅ Complete customer lifecycle (Create → Read → Update → Delete)

## Configuration

Tests are configured in `playwright.config.ts`:
- **Base URL**: http://localhost:5173
- **Timeout**: 30 seconds per test
- **Retries**: 2 on CI, 0 locally
- **Browsers**: Chromium (default)
- **Reporters**: HTML, JSON, JUnit, List
- **Web Servers**: Automatically starts API (port 3000) and Web (port 5173)

## Page Object Models

### CustomersPage
Main customers list page with methods for:
- Navigation
- Search
- Pagination
- Sorting
- Opening create/edit/delete dialogs

### CreateCustomerDialog
Create customer dialog with methods for:
- Filling form fields
- Submitting form
- Canceling operation

### EditCustomerDialog
Edit customer dialog with methods for:
- Updating specific fields
- Saving changes

### DeleteCustomerDialog
Delete confirmation dialog with methods for:
- Confirming deletion
- Canceling operation

## Test Data

Tests use `@faker-js/faker` to generate realistic test data:

```typescript
import { generateCustomer } from '../fixtures/customer-fixtures';

const testCustomer = generateCustomer({
  firstName: 'John', // Override specific fields
  lastName: 'Doe'
});
```

## CI/CD Integration

Tests can run automatically on:
- Pull requests
- Pushes to main branch
- Manual workflow dispatch

Reports are uploaded as artifacts for review.

## Debugging

### UI Mode (Recommended)
```bash
pnpm test:e2e:ui
```
Provides interactive test runner with:
- Time travel debugging
- Watch mode
- Test filtering
- Visual test inspection

### Debug Mode
```bash
pnpm test:e2e:debug
```
Opens Playwright Inspector for step-by-step debugging.

### Headed Mode
```bash
pnpm test:e2e:headed
```
Runs tests with visible browser window.

## Best Practices

1. **Use Page Object Model** - Encapsulate page interactions
2. **Use Accessibility Selectors** - `getByRole`, `getByLabel`, `getByText`
3. **Avoid Hard Waits** - Use `waitForTimeout` sparingly, prefer auto-waiting
4. **Generate Test Data** - Use faker for realistic data
5. **Clean Assertions** - One concept per test
6. **Parallel Execution** - Tests should be independent

## Troubleshooting

### Tests Failing to Start
- Ensure Docker is running (`pnpm docker:up`)
- Verify ports 3000 and 5173 are available
- Check `.env` file in `apps/api`

### Flaky Tests
- Increase timeouts if network is slow
- Add proper wait conditions
- Check for race conditions

### Browser Not Installed
```bash
pnpm exec playwright install --with-deps chromium
```

## Future Enhancements

- [ ] Add visual regression tests
- [ ] Add API response mocking for edge cases
- [ ] Add mobile viewport tests
- [ ] Add accessibility tests (a11y)
- [ ] Add performance tests (Core Web Vitals)

