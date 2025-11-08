import type { Customer, PrismaClient } from "../generated/prisma";

export interface ICustomerRepository {
  findAll(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  create(
    data: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ): Promise<Customer>;
  update(
    id: string,
    data: Partial<Omit<Customer, "id" | "createdAt" | "updatedAt">>
  ): Promise<Customer>;
  delete(id: string): Promise<Customer>;
  count(): Promise<number>;
}

export class CustomerRepository implements ICustomerRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Customer[]> {
    return await this.prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<Customer | null> {
    return await this.prisma.customer.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return await this.prisma.customer.findUnique({
      where: { email },
    });
  }

  async create(
    data: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ): Promise<Customer> {
    return await this.prisma.customer.create({
      data,
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Customer, "id" | "createdAt" | "updatedAt">>
  ): Promise<Customer> {
    return await this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Customer> {
    return await this.prisma.customer.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return await this.prisma.customer.count();
  }
}
