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
    console.log("🔍 [updateCustomer] START");
    console.log("📝 [updateCustomer] Customer ID:", id);
    console.log(
      "📦 [updateCustomer] Raw input:",
      JSON.stringify(input, null, 2)
    );

    // Check if customer exists
    console.log("🔎 [updateCustomer] Checking if customer exists...");
    const existingCustomer = await this.getCustomerById(id);
    console.log("✅ [updateCustomer] Customer found:", existingCustomer.email);

    // Remove id from input if it was sent (we use the path parameter instead)
    const { id: _inputId, ...inputWithoutId } = input as any;
    console.log(
      "🧹 [updateCustomer] Input after removing ID:",
      JSON.stringify(inputWithoutId, null, 2)
    );

    // Validate update data
    console.log("🔐 [updateCustomer] Validating data with Zod...");
    try {
      const validatedData = updateCustomerSchema.parse({
        id,
        ...inputWithoutId,
      });
      console.log(
        "✅ [updateCustomer] Validation passed:",
        JSON.stringify(validatedData, null, 2)
      );

      // If email is being updated, check it's not already taken
      if (inputWithoutId.email) {
        console.log(
          "📧 [updateCustomer] Checking if email is available:",
          inputWithoutId.email
        );
        const existingCustomer = await this.customerRepository.findByEmail(
          inputWithoutId.email
        );
        if (existingCustomer && existingCustomer.id !== id) {
          console.error(
            "❌ [updateCustomer] Email already taken:",
            inputWithoutId.email
          );
          throw new Error(
            `Customer with email ${inputWithoutId.email} already exists`
          );
        }
        console.log("✅ [updateCustomer] Email is available");
      }

      // Remove id and timestamps from update data
      const { id: _id, createdAt, updatedAt, ...updateData } = validatedData;
      console.log(
        "🗑️  [updateCustomer] Data after removing id/timestamps:",
        JSON.stringify(updateData, null, 2)
      );

      // Convert empty strings and undefined to null for optional fields
      const cleanUpdateData: Partial<
        Omit<Customer, "id" | "createdAt" | "updatedAt">
      > = {};

      for (const [key, value] of Object.entries(updateData)) {
        if (value === "" || value === undefined) {
          console.log(`🧼 [updateCustomer] Converting empty "${key}" to null`);
          cleanUpdateData[key as keyof typeof cleanUpdateData] = null as any;
        } else {
          cleanUpdateData[key as keyof typeof cleanUpdateData] = value as any;
        }
      }

      console.log(
        "✨ [updateCustomer] Final clean data:",
        JSON.stringify(cleanUpdateData, null, 2)
      );

      // Update customer
      console.log("💾 [updateCustomer] Updating in database...");
      const updatedCustomer = await this.customerRepository.update(
        id,
        cleanUpdateData
      );
      console.log(
        "🎉 [updateCustomer] SUCCESS - Customer updated:",
        updatedCustomer.id
      );
      console.log(
        "📊 [updateCustomer] Updated fields:",
        Object.keys(cleanUpdateData).join(", ")
      );

      return updatedCustomer;
    } catch (error) {
      console.error("❌ [updateCustomer] ERROR occurred:");
      console.error("📛 [updateCustomer] Error type:", error.constructor.name);
      console.error("💬 [updateCustomer] Error message:", error.message);
      if (error.errors) {
        console.error(
          "🔍 [updateCustomer] Zod validation errors:",
          JSON.stringify(error.errors, null, 2)
        );
      }
      throw error;
    }
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
