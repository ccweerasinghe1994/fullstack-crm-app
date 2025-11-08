import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Customer, PrismaClient } from "../generated/prisma";
import { createMockPrismaClient } from "../test/helpers/prisma-mock";
import { CustomerRepository } from "./customer.repository";

describe("CustomerRepository", () => {
  let repository: CustomerRepository;
  let mockPrisma: PrismaClient;

  // Sample customer data
  const mockCustomer: Customer = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1-555-0101",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    country: "USA",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();
    repository = new CustomerRepository(mockPrisma);
  });

  describe("findAll", () => {
    it("should return all customers ordered by createdAt desc", async () => {
      const mockCustomers = [mockCustomer];
      vi.mocked(mockPrisma.customer.findMany).mockResolvedValue(mockCustomers);

      const result = await repository.findAll();

      expect(result).toEqual(mockCustomers);
      expect(mockPrisma.customer.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return empty array when no customers exist", async () => {
      vi.mocked(mockPrisma.customer.findMany).mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe("findById", () => {
    it("should return customer when found", async () => {
      vi.mocked(mockPrisma.customer.findUnique).mockResolvedValue(mockCustomer);

      const result = await repository.findById(mockCustomer.id);

      expect(result).toEqual(mockCustomer);
      expect(mockPrisma.customer.findUnique).toHaveBeenCalledWith({
        where: { id: mockCustomer.id },
      });
    });

    it("should return null when customer not found", async () => {
      vi.mocked(mockPrisma.customer.findUnique).mockResolvedValue(null);

      const result = await repository.findById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should return customer when found by email", async () => {
      vi.mocked(mockPrisma.customer.findUnique).mockResolvedValue(mockCustomer);

      const result = await repository.findByEmail(mockCustomer.email);

      expect(result).toEqual(mockCustomer);
      expect(mockPrisma.customer.findUnique).toHaveBeenCalledWith({
        where: { email: mockCustomer.email },
      });
    });

    it("should return null when customer not found by email", async () => {
      vi.mocked(mockPrisma.customer.findUnique).mockResolvedValue(null);

      const result = await repository.findByEmail("nonexistent@example.com");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a new customer", async () => {
      const newCustomerData = {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phoneNumber: "+1-555-0102",
        address: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
      };

      const createdCustomer: Customer = {
        id: "456e7890-e89b-12d3-a456-426614174000",
        ...newCustomerData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockPrisma.customer.create).mockResolvedValue(createdCustomer);

      const result = await repository.create(newCustomerData);

      expect(result).toEqual(createdCustomer);
      expect(mockPrisma.customer.create).toHaveBeenCalledWith({
        data: newCustomerData,
      });
    });
  });

  describe("update", () => {
    it("should update an existing customer", async () => {
      const updateData = {
        firstName: "John Updated",
        phoneNumber: "+1-555-9999",
      };

      const updatedCustomer: Customer = {
        ...mockCustomer,
        ...updateData,
        updatedAt: new Date(),
      };

      vi.mocked(mockPrisma.customer.update).mockResolvedValue(updatedCustomer);

      const result = await repository.update(mockCustomer.id, updateData);

      expect(result).toEqual(updatedCustomer);
      expect(mockPrisma.customer.update).toHaveBeenCalledWith({
        where: { id: mockCustomer.id },
        data: updateData,
      });
    });
  });

  describe("delete", () => {
    it("should delete a customer", async () => {
      vi.mocked(mockPrisma.customer.delete).mockResolvedValue(mockCustomer);

      const result = await repository.delete(mockCustomer.id);

      expect(result).toEqual(mockCustomer);
      expect(mockPrisma.customer.delete).toHaveBeenCalledWith({
        where: { id: mockCustomer.id },
      });
    });
  });

  describe("count", () => {
    it("should return the total count of customers", async () => {
      vi.mocked(mockPrisma.customer.count).mockResolvedValue(5);

      const result = await repository.count();

      expect(result).toBe(5);
      expect(mockPrisma.customer.count).toHaveBeenCalled();
    });

    it("should return 0 when no customers exist", async () => {
      vi.mocked(mockPrisma.customer.count).mockResolvedValue(0);

      const result = await repository.count();

      expect(result).toBe(0);
    });
  });
});
