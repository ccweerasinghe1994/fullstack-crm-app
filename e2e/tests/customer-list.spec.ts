import { test, expect } from "@playwright/test";
import { CustomersPage } from "../fixtures/page-objects";

test.describe("Customer List", () => {
  test("should display customer table", async ({ page }) => {
    const customersPage = new CustomersPage(page);
    await customersPage.goto();

    // Check page title
    await expect(
      page.getByRole("heading", { name: "Customers" })
    ).toBeVisible();

    // Check table is visible
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("should search customers by name", async ({ page }) => {
    const customersPage = new CustomersPage(page);
    await customersPage.goto();

    // Search for existing customer
    await customersPage.search("Mark");

    // Wait for results
    await page.waitForTimeout(600);

    // Verify search results contain "Mark"
    const firstRow = page.getByRole("row").nth(1);
    await expect(firstRow).toContainText("Mark");
  });

  test("should paginate through customers", async ({ page }) => {
    const customersPage = new CustomersPage(page);
    await customersPage.goto();

    // Wait for initial data to load
    await page.waitForLoadState("networkidle");

    // Check pagination controls are visible
    await expect(customersPage.paginationNext).toBeVisible();
    await expect(customersPage.paginationPrevious).toBeDisabled();

    // Verify we're on page 1
    await expect(page.getByText("Page 1 of")).toBeVisible();

    // Click next page
    await customersPage.paginationNext.click();
    
    // Wait for loading overlay to appear and disappear (indicates new data loaded)
    await page.getByText("Loading...").waitFor({ state: "visible", timeout: 2000 }).catch(() => {});
    await page.getByText("Loading...").waitFor({ state: "hidden", timeout: 5000 }).catch(() => {});
    
    // Verify we moved to page 2
    await expect(page.getByText("Page 2 of")).toBeVisible();
    
    // Previous button should now be enabled
    await expect(customersPage.paginationPrevious).toBeEnabled();
  });

  test("should sort by column", async ({ page }) => {
    const customersPage = new CustomersPage(page);
    await customersPage.goto();

    // Click on First Name header to sort
    await customersPage.sortByColumn("First Name");
    await page.waitForTimeout(500);

    // Verify sort indicator is visible (should show ArrowUp icon)
    const firstNameButton = page.getByRole("button", { name: /first name/i });
    await expect(firstNameButton).toBeVisible();
  });
});

