import { test, expect } from "@playwright/test";
import {
  CustomersPage,
  CreateCustomerDialog,
  EditCustomerDialog,
  DeleteCustomerDialog,
} from "../fixtures/page-objects";
import { generateCustomer } from "../fixtures/customer-fixtures";

test.describe("Full CRUD Workflow", () => {
  test("should complete full customer lifecycle", async ({ page }) => {
    const customersPage = new CustomersPage(page);
    const createDialog = new CreateCustomerDialog(page);
    const editDialog = new EditCustomerDialog(page);
    const deleteDialog = new DeleteCustomerDialog(page);

    // Navigate to customers page
    await customersPage.goto();

    // CREATE
    await customersPage.openCreateDialog();
    const newCustomer = generateCustomer();
    await createDialog.fillForm(newCustomer);
    await createDialog.submit();
    await expect(
      page.getByText(/customer created successfully/i)
    ).toBeVisible();

    // READ (Search)
    await customersPage.search(newCustomer.email);
    await expect(page.getByText(newCustomer.email)).toBeVisible();
    // Verify firstName in table row (not toast)
    const tableRow = page.getByRole("row").filter({ hasText: newCustomer.email });
    await expect(tableRow).toContainText(newCustomer.firstName);

    // UPDATE
    await customersPage.clickEdit(newCustomer.email);
    const updatedFirstName = "UpdatedE2E";
    await editDialog.updateField("first name", updatedFirstName);
    await editDialog.save();
    await expect(
      page.getByText(/customer updated successfully/i)
    ).toBeVisible();
    
    // Verify update in table (not toast)
    const updatedRow = page.getByRole("row").filter({ hasText: newCustomer.email });
    await expect(updatedRow).toContainText(updatedFirstName);

    // DELETE
    await customersPage.clickDelete(newCustomer.email);
    await deleteDialog.confirm();
    await expect(
      page.getByText(/customer deleted successfully/i)
    ).toBeVisible();

    // Verify deletion
    await customersPage.search(newCustomer.email);
    await expect(page.getByText("No results")).toBeVisible();
  });
});

