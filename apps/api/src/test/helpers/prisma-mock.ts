import { vi } from "vitest";
import type { PrismaClient } from "../../generated/prisma";

/**
 * Create a mock Prisma client for testing
 */
export function createMockPrismaClient(): PrismaClient {
  return {
    customer: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $transaction: vi.fn(),
  } as unknown as PrismaClient;
}

/**
 * Reset all mocks on a Prisma client
 */
export function resetPrismaMocks(_prisma: PrismaClient): void {
  vi.clearAllMocks();
}
