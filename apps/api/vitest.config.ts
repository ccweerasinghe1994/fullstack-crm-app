import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Test environment
    environment: "node",

    // Global test setup
    globals: true,

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "src/generated/",
        "**/*.test.ts",
        "**/*.spec.ts",
        "vitest.config.ts",
        "prisma/",
      ],
    },

    // Test file patterns
    include: ["src/**/*.{test,spec}.ts"],
    exclude: ["node_modules/", "dist/", "src/generated/"],

    // Test timeout
    testTimeout: 10000,

    // Setup files (if needed)
    // setupFiles: ["./src/test/setup.ts"],

    // Mock reset
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,

    // Parallel execution (default with threads pool)
    pool: "threads",
  },
});
