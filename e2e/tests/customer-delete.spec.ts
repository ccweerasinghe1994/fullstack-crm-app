import { expect, test } from "@playwright/test";
import { CustomersPage, DeleteCustomerDialog } from "../fixtures/page-objects";

test.describe("Delete Customer", () => {
  test("should delete a customer", async ({ page }) => {
    // Start with fresh page state
    await page.goto("/customers");
    const customersPage = new CustomersPage(page);
    const deleteDialog = new DeleteCustomerDialog(page);

    await customersPage.goto();

    // Wait for full initialization
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    // Get customer email before deleting
    const customerEmail = await page
      .getByRole("row")
      .nth(1)
      .getByRole("cell")
      .nth(3)
      .textContent();

    // Delete first customer
    await customersPage.clickDelete(customerEmail!);
    await deleteDialog.confirm();

    // Verify success toast
    await expect(
      page.getByText(/customer deleted successfully/i)
    ).toBeVisible();

    // Verify customer is removed - wait for search to complete
    await customersPage.search(customerEmail!);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("No results")).toBeVisible();
  });

  test("should cancel delete operation", async ({ page }) => {
    const customersPage = new CustomersPage(page);
    const deleteDialog = new DeleteCustomerDialog(page);

    // Start with fresh page state
    await page.goto("/customers");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    const customerEmail = await page
      .getByRole("row")
      .nth(1)
      .getByRole("cell")
      .nth(3)
      .textContent();

    // Open delete dialog and cancel
    await customersPage.clickDelete(customerEmail!);
    await deleteDialog.cancel();

    // Wait for dialog to close
    await page.waitForTimeout(500);

    // Verify customer still exists in the current table view (no search needed)
    // Use table row to avoid strict mode violations
    const tableRow = page.getByRole("row").filter({ hasText: customerEmail! });
    await expect(tableRow).toBeVisible();
  });
});
