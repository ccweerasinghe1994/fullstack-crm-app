import type { Page, Locator } from "@playwright/test";

export class CustomersPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly addCustomerButton: Locator;
  readonly tableRows: Locator;
  readonly paginationNext: Locator;
  readonly paginationPrevious: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder("Search customers...");
    this.addCustomerButton = page.getByRole("button", {
      name: /add customer/i,
    });
    this.tableRows = page.getByRole("row");
    this.paginationNext = page.getByRole("button", { name: "Next" });
    this.paginationPrevious = page.getByRole("button", { name: "Previous" });
  }

  async goto() {
    await this.page.goto("/customers");
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    // Wait for debounce (500ms + buffer)
    await this.page.waitForTimeout(600);
  }

  async openCreateDialog() {
    await this.addCustomerButton.click();
  }

  async getRowCount() {
    // Subtract 1 for header row
    return (await this.tableRows.count()) - 1;
  }

  async clickEdit(customerEmail: string) {
    const row = this.page.getByRole("row").filter({ hasText: customerEmail });
    const menuButton = row.getByRole("button", { name: /open menu/i }).first();
    
    // Ensure table is fully loaded before interaction
    await this.page.waitForLoadState("networkidle");
    
    // Click to open menu
    await menuButton.click();
    
    // Wait for menu portal to render (Radix UI uses portals)
    await this.page.waitForTimeout(700);
    
    // Find and click Edit item (try multiple selectors for reliability)
    try {
      const editItem = this.page.locator('[role="menuitem"]').filter({ hasText: "Edit" }).first();
      await editItem.click({ timeout: 2000 });
    } catch {
      // Fallback: use keyboard navigation
      await this.page.keyboard.press("ArrowDown");
      await this.page.keyboard.press("ArrowDown");
      await this.page.keyboard.press("Enter");
    }
    
    // Wait for Edit Customer dialog to appear
    await this.page.getByRole("heading", { name: "Edit Customer" }).waitFor();
  }

  async clickDelete(customerEmail: string) {
    const row = this.page.getByRole("row").filter({ hasText: customerEmail });
    const menuButton = row.getByRole("button", { name: /open menu/i }).first();
    
    // Ensure table is fully loaded before interaction
    await this.page.waitForLoadState("networkidle");
    
    // Click to open menu
    await menuButton.click();
    
    // Wait for menu portal to render (Radix UI uses portals)
    await this.page.waitForTimeout(700);
    
    // Find and click Delete item (try multiple selectors for reliability)
    try {
      const deleteItem = this.page.locator('[role="menuitem"]').filter({ hasText: "Delete" }).first();
      await deleteItem.click({ timeout: 2000 });
    } catch {
      // Fallback: use keyboard navigation
      await this.page.keyboard.press("ArrowDown");
      await this.page.keyboard.press("ArrowDown");
      await this.page.keyboard.press("ArrowDown");
      await this.page.keyboard.press("Enter");
    }
    
    // Wait for Delete Customer dialog to appear
    await this.page.getByRole("heading", { name: "Delete Customer" }).waitFor();
  }

  async sortByColumn(columnName: string) {
    await this.page.getByRole("button", { name: columnName }).click();
  }
}

export class CreateCustomerDialog {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly countrySelect: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByLabel(/first name/i);
    this.lastNameInput = page.getByLabel(/last name/i);
    this.emailInput = page.getByLabel(/email/i);
    this.phoneInput = page.getByLabel(/phone/i);
    this.addressInput = page.getByLabel(/address/i);
    this.cityInput = page.getByLabel(/city/i);
    this.stateInput = page.getByLabel(/state/i);
    this.countrySelect = page.getByLabel(/country/i);
    this.submitButton = page.getByRole("button", {
      name: /create customer/i,
    });
    this.cancelButton = page.getByRole("button", { name: /cancel/i });
  }

  async fillForm(customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  }) {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.emailInput.fill(customer.email);

    if (customer.phone) await this.phoneInput.fill(customer.phone);
    if (customer.address) await this.addressInput.fill(customer.address);
    if (customer.city) await this.cityInput.fill(customer.city);
    if (customer.state) await this.stateInput.fill(customer.state);
    if (customer.country) await this.countrySelect.fill(customer.country);
  }

  async submit() {
    await this.submitButton.click();
    // Wait for dialog to close
    await this.page.waitForTimeout(500);
  }
}

export class EditCustomerDialog {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async updateField(label: string, value: string) {
    await this.page.getByLabel(new RegExp(label, "i")).fill(value);
  }

  async save() {
    // Find save button in dialog footer
    const saveButton = this.page
      .getByRole("dialog")
      .getByRole("button", { name: /save/i });
    await saveButton.click();
    // Wait for success toast instead of dialog closing
    await this.page.waitForTimeout(1000);
  }
}

export class DeleteCustomerDialog {
  readonly page: Page;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Get the delete button inside the dialog footer
    this.confirmButton = page
      .getByRole("dialog")
      .getByRole("button", { name: /delete/i });
    this.cancelButton = page
      .getByRole("dialog")
      .getByRole("button", { name: /cancel/i });
  }

  async confirm() {
    await this.confirmButton.click();
    await this.page.waitForTimeout(500);
  }

  async cancel() {
    await this.cancelButton.click();
  }
}

