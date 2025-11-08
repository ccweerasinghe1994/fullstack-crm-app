import {
  createCustomerSchema,
  updateCustomerSchema,
  type CreateCustomerInput,
} from "@crm/shared";
import type { Customer } from "../generated/prisma";
import type { ICustomerRepository } from "../repositories/customer.repository";

export class CustomerService {
  constructor(private customerRepository: ICustomerRepository) {}

  async getAllCustomers(): Promise<Customer[]> {
    return await this.customerRepository.findAll();
  }

  async getCustomerById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new Error(`Customer with id ${id} not found`);
    }

    return customer;
  }

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    // Validate input
    const validatedData = createCustomerSchema.parse(input);

    // Check if email already exists
    const existingCustomer = await this.customerRepository.findByEmail(
      validatedData.email
    );
    if (existingCustomer) {
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

    return await this.customerRepository.create(createData);
  }

  async updateCustomer(
    id: string,
    input: Partial<CreateCustomerInput>
  ): Promise<Customer> {
    // Check if customer exists
    await this.getCustomerById(id);

    // Validate update data
    const validatedData = updateCustomerSchema.parse({ id, ...input });

    // If email is being updated, check it's not already taken
    if (input.email) {
      const existingCustomer = await this.customerRepository.findByEmail(
        input.email
      );
      if (existingCustomer && existingCustomer.id !== id) {
        throw new Error(`Customer with email ${input.email} already exists`);
      }
    }

    // Remove id from update data
    const { id: _id, ...updateData } = validatedData;

    // Update customer
    return await this.customerRepository.update(id, updateData);
  }

  async deleteCustomer(id: string): Promise<void> {
    // Check if customer exists
    await this.getCustomerById(id);

    // Delete customer
    await this.customerRepository.delete(id);
  }

  async getCustomerCount(): Promise<number> {
    return await this.customerRepository.count();
  }
}
