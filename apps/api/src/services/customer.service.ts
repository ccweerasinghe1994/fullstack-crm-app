import {
  createCustomerSchema,
  updateCustomerSchema,
  type CreateCustomerInput,
} from "@crm/shared";
import { logger } from "../config/logger";
import type { Customer } from "../generated/prisma";
import type { ICustomerRepository } from "../repositories/customer.repository";
import type {
  PaginatedResponse,
  PaginationParams,
} from "../types/pagination.types";

export class CustomerService {
  constructor(private customerRepository: ICustomerRepository) {}

  async getAllCustomers(): Promise<Customer[]> {
    return await this.customerRepository.findAll();
  }

  async getAllCustomersPaginated(
    params: PaginationParams
  ): Promise<PaginatedResponse<Customer>> {
    logger.debug("Fetching paginated customers", { params });
    const result = await this.customerRepository.findAllPaginated(params);
    logger.debug(`Retrieved ${result.data.length} customers`, {
      page: result.meta.page,
      total: result.meta.total,
    });
    return result;
  }

  async getCustomerById(id: string): Promise<Customer> {
    logger.debug(`Fetching customer by ID: ${id}`);
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      logger.warn(`Customer not found: ${id}`);
      throw new Error(`Customer with id ${id} not found`);
    }

    logger.debug(`Customer found: ${customer.email}`);
    return customer;
  }

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    logger.debug("Creating new customer", { email: input.email });
    
    // Validate input
    const validatedData = createCustomerSchema.parse(input);

    // Check if email already exists
    const existingCustomer = await this.customerRepository.findByEmail(
      validatedData.email
    );
    if (existingCustomer) {
      logger.warn(`Duplicate email attempt: ${validatedData.email}`);
      throw new Error(
        `Customer with email ${validatedData.email} already exists`
      );
    }

    // Create customer (ensure undefined is converted to null for optional fields)
    const createData = {
      ...validatedData,
      phoneNumber: validatedData.phoneNumber ?? null,
      address: validatedData.address ?? null,
      city: validatedData.city ?? null,
      state: validatedData.state ?? null,
      country: validatedData.country ?? null,
    };

    const customer = await this.customerRepository.create(createData);
    logger.info(`Customer created successfully: ${customer.email}`, {
      customerId: customer.id,
    });
    return customer;
  }

  async updateCustomer(
    id: string,
    input: Partial<CreateCustomerInput>
  ): Promise<Customer> {
    logger.debug(`Updating customer: ${id}`, { updates: Object.keys(input) });
    
    // Check if customer exists
    const existingCustomer = await this.getCustomerById(id);

    // Remove id from input if it was sent (we use the path parameter instead)
    const { id: _inputId, ...inputWithoutId } = input as any;

    // Validate update data
    const validatedData = updateCustomerSchema.parse({
      id,
      ...inputWithoutId,
    });

    // If email is being updated, check it's not already taken
    if (inputWithoutId.email) {
      const emailCheck = await this.customerRepository.findByEmail(
        inputWithoutId.email
      );
      if (emailCheck && emailCheck.id !== id) {
        logger.warn(`Email conflict on update: ${inputWithoutId.email}`);
        throw new Error(
          `Customer with email ${inputWithoutId.email} already exists`
        );
      }
    }

    // Remove id and timestamps from update data
    const { id: _id, createdAt, updatedAt, ...updateData } = validatedData;

    // Convert empty strings and undefined to null for optional fields
    const cleanUpdateData: Partial<
      Omit<Customer, "id" | "createdAt" | "updatedAt">
    > = {};

    for (const [key, value] of Object.entries(updateData)) {
      if (value === "" || value === undefined) {
        cleanUpdateData[key as keyof typeof cleanUpdateData] = null as any;
      } else {
        cleanUpdateData[key as keyof typeof cleanUpdateData] = value as any;
      }
    }

    // Update customer
    const updatedCustomer = await this.customerRepository.update(id, cleanUpdateData);
    logger.info(`Customer updated successfully: ${updatedCustomer.email}`, {
      customerId: id,
      fields: Object.keys(cleanUpdateData),
    });
    return updatedCustomer;
  }

  async deleteCustomer(id: string): Promise<void> {
    logger.debug(`Deleting customer: ${id}`);
    
    // Check if customer exists
    const customer = await this.getCustomerById(id);

    // Delete customer
    await this.customerRepository.delete(id);
    
    logger.info(`Customer deleted successfully: ${customer.email}`, {
      customerId: id,
    });
  }

  async getCustomerCount(): Promise<number> {
    return await this.customerRepository.count();
  }
}
