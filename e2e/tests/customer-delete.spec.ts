import { test, expect } from "@playwright/test";
import {
  CustomersPage,
  DeleteCustomerDialog,
} from "../fixtures/page-objects";

test.describe("Delete Customer", () => {
  test("should delete a customer", async ({ page }) => {
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

    await customersPage.goto();
    await page.waitForLoadState("networkidle");

    const customerEmail = await page
      .getByRole("row")
      .nth(1)
      .getByRole("cell")
      .nth(3)
      .textContent();

    // Open delete dialog and cancel
    await customersPage.clickDelete(customerEmail!);
    await deleteDialog.cancel();

    // Verify customer still exists by searching for it
    await customersPage.search(customerEmail!);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(customerEmail!)).toBeVisible();
  });
});

