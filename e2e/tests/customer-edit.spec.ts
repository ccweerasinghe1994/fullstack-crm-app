import { expect, test } from "@playwright/test";
import { CustomersPage, EditCustomerDialog } from "../fixtures/page-objects";

test.describe("Edit Customer", () => {
  test("should edit customer details", async ({ page }) => {
    const customersPage = new CustomersPage(page);
    const editDialog = new EditCustomerDialog(page);

    await customersPage.goto();

    // Wait for full initialization
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    // Find first customer and edit
    const firstEmail = await page
      .getByRole("row")
      .nth(1)
      .getByRole("cell")
      .nth(3)
      .textContent();
    await customersPage.clickEdit(firstEmail!);

    // Update first name
    await editDialog.updateField("first name", "UpdatedName");
    await editDialog.save();

    // Verify success toast
    await expect(
      page.getByText(/customer updated successfully/i)
    ).toBeVisible();

    // Verify update in table (scope to table row to avoid strict mode violation)
    const tableRow = page.getByRole("row").filter({ hasText: firstEmail! });
    await expect(tableRow).toContainText("UpdatedName");
  });
});
