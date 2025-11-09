import { test, expect } from "@playwright/test";
import {
  CustomersPage,
  CreateCustomerDialog,
} from "../fixtures/page-objects";
import { generateCustomer } from "../fixtures/customer-fixtures";

test.describe("Create Customer", () => {
  test("should create a new customer with all fields", async ({ page }) => {
    const customersPage = new CustomersPage(page);
    const createDialog = new CreateCustomerDialog(page);

    await customersPage.goto();
    await customersPage.openCreateDialog();

    const newCustomer = generateCustomer();
    await createDialog.fillForm(newCustomer);
    await createDialog.submit();

    // Verify success toast
    await expect(
      page.getByText(/customer created successfully/i)
    ).toBeVisible();

    // Search for new customer
    await customersPage.search(newCustomer.email);
    await expect(page.getByText(newCustomer.email)).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    const customersPage = new CustomersPage(page);
    const createDialog = new CreateCustomerDialog(page);

    await customersPage.goto();
    await customersPage.openCreateDialog();

    // Try to submit without filling fields
    await createDialog.submitButton.click();

    // Check for validation errors
    await expect(page.getByText(/required/i)).toHaveCount(3); // firstName, lastName, email
  });
});

