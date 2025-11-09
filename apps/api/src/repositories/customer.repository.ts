import type { Customer, PrismaClient } from "../generated/prisma";
import type {
  PaginatedResponse,
  PaginationParams,
} from "../types/pagination.types";

export interface ICustomerRepository {
  findAll(): Promise<Customer[]>;
  findAllPaginated(
    params: PaginationParams
  ): Promise<PaginatedResponse<Customer>>;
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

  async findAllPaginated(
    params: PaginationParams
  ): Promise<PaginatedResponse<Customer>> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const sortBy = params.sortBy || "createdAt";
    const order = params.order || "desc";

    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const total = await this.prisma.customer.count();

    // Fetch paginated data
    const data = await this.prisma.customer.findMany({
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
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
