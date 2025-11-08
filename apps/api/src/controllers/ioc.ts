import { IocContainer } from "@tsoa/runtime";
import { PrismaClient } from "../generated/prisma";
import { CustomerRepository } from "../repositories/customer.repository";
import { CustomerService } from "../services/customer.service";
import { CustomerController } from "./customerController";

// Initialize Prisma Client
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

// Initialize layers (Dependency Injection)
const customerRepository = new CustomerRepository(prisma);
const customerService = new CustomerService(customerRepository);

/**
 * IoC Container for TSOA
 * This is used by TSOA to resolve controller dependencies
 */
export const iocContainer: IocContainer = {
  get: <T>(controller: any): T => {
    if (
      controller.prototype instanceof CustomerController ||
      controller === CustomerController
    ) {
      return new CustomerController(customerService) as T;
    }
    throw new Error(`Unknown controller: ${controller.name}`);
  },
};

export { prisma };
