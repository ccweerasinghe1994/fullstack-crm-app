import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import type { Customer } from "../generated/prisma";
import type { ICustomerRepository } from "../repositories/customer.repository";
import { CustomerService } from "./customer.service";

describe("CustomerService", () => {
  let service: CustomerService;
  let mockRepository: ICustomerRepository;

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
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    };
    service = new CustomerService(mockRepository);
  });

  describe("getAllCustomers", () => {
    it("should return all customers", async () => {
      const mockCustomers = [mockCustomer];
      vi.mocked(mockRepository.findAll).mockResolvedValue(mockCustomers);

      const result = await service.getAllCustomers();

      expect(result).toEqual(mockCustomers);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe("getCustomerById", () => {
    it("should return customer when found", async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockCustomer);

      const result = await service.getCustomerById(mockCustomer.id);

      expect(result).toEqual(mockCustomer);
      expect(mockRepository.findById).toHaveBeenCalledWith(mockCustomer.id);
    });

    it("should throw error when customer not found", async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(service.getCustomerById("non-existent-id")).rejects.toThrow(
        "Customer with id non-existent-id not found"
      );
    });
  });

  describe("createCustomer", () => {
    const validInput = {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phoneNumber: "+1-555-0102",
      address: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
    };

    it("should create a new customer with valid data", async () => {
      const createdCustomer: Customer = {
        id: "456e7890-e89b-12d3-a456-426614174000",
        ...validInput,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(mockRepository.create).mockResolvedValue(createdCustomer);

      const result = await service.createCustomer(validInput);

      expect(result).toEqual(createdCustomer);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it("should throw error when email already exists", async () => {
      vi.mocked(mockRepository.findByEmail).mockResolvedValue(mockCustomer);

      await expect(service.createCustomer(validInput)).rejects.toThrow(
        `Customer with email ${validInput.email} already exists`
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("should throw ZodError for invalid email", async () => {
      const invalidInput = {
        firstName: "Jane",
        lastName: "Smith",
        email: "invalid-email",
      };

      await expect(service.createCustomer(invalidInput as any)).rejects.toThrow(
        ZodError
      );
    });

    it("should throw ZodError for missing required fields", async () => {
      const invalidInput = {
        firstName: "Jane",
        // lastName missing
        email: "jane@example.com",
      };

      await expect(service.createCustomer(invalidInput as any)).rejects.toThrow(
        ZodError
      );
    });
  });

  describe("updateCustomer", () => {
    const updateInput = {
      firstName: "John Updated",
      phoneNumber: "+1-555-9999",
    };

    it("should update an existing customer", async () => {
      const updatedCustomer: Customer = {
        ...mockCustomer,
        ...updateInput,
        updatedAt: new Date(),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(mockCustomer);
      vi.mocked(mockRepository.update).mockResolvedValue(updatedCustomer);

      const result = await service.updateCustomer(mockCustomer.id, updateInput);

      expect(result).toEqual(updatedCustomer);
      expect(mockRepository.findById).toHaveBeenCalledWith(mockCustomer.id);
      expect(mockRepository.update).toHaveBeenCalled();
    });

    it("should throw error when customer not found", async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(
        service.updateCustomer("non-existent-id", updateInput)
      ).rejects.toThrow("Customer with id non-existent-id not found");
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it("should check for duplicate email when updating email", async () => {
      const emailUpdate = { email: "newemail@example.com" };
      const existingCustomer: Customer = {
        ...mockCustomer,
        id: "different-id",
        email: emailUpdate.email,
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(mockCustomer);
      vi.mocked(mockRepository.findByEmail).mockResolvedValue(existingCustomer);

      await expect(
        service.updateCustomer(mockCustomer.id, emailUpdate)
      ).rejects.toThrow(
        `Customer with email ${emailUpdate.email} already exists`
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it("should allow updating email to same email", async () => {
      const emailUpdate = { email: mockCustomer.email };
      const updatedCustomer: Customer = {
        ...mockCustomer,
        updatedAt: new Date(),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(mockCustomer);
      vi.mocked(mockRepository.findByEmail).mockResolvedValue(mockCustomer);
      vi.mocked(mockRepository.update).mockResolvedValue(updatedCustomer);

      const result = await service.updateCustomer(mockCustomer.id, emailUpdate);

      expect(result).toEqual(updatedCustomer);
      expect(mockRepository.update).toHaveBeenCalled();
    });
  });

  describe("deleteCustomer", () => {
    it("should delete an existing customer", async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockCustomer);
      vi.mocked(mockRepository.delete).mockResolvedValue(mockCustomer);

      await service.deleteCustomer(mockCustomer.id);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockCustomer.id);
      expect(mockRepository.delete).toHaveBeenCalledWith(mockCustomer.id);
    });

    it("should throw error when customer not found", async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(service.deleteCustomer("non-existent-id")).rejects.toThrow(
        "Customer with id non-existent-id not found"
      );
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe("getCustomerCount", () => {
    it("should return the total count of customers", async () => {
      vi.mocked(mockRepository.count).mockResolvedValue(5);

      const result = await service.getCustomerCount();

      expect(result).toBe(5);
      expect(mockRepository.count).toHaveBeenCalled();
    });

    it("should return 0 when no customers exist", async () => {
      vi.mocked(mockRepository.count).mockResolvedValue(0);

      const result = await service.getCustomerCount();

      expect(result).toBe(0);
    });
  });
});
