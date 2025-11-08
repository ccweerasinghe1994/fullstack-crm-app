import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";

// Mock environment variables for testing
beforeAll(() => {
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL =
    process.env.DATABASE_URL ||
    "postgresql://crm_user:crm_password@localhost:5432/crm_test_db";
});

// Clean up after all tests
afterAll(() => {
  // Any global cleanup
});

// Reset state before each test
beforeEach(() => {
  // Any per-test setup
});

// Clean up after each test
afterEach(() => {
  // Any per-test cleanup
});
