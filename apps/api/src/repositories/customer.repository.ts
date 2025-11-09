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
    const search = params.search;

    const skip = (page - 1) * limit;

    // If search is provided, use full-text search with raw SQL
    if (search) {
      // Get total count with search filter
      const totalResult = await this.prisma.$queryRawUnsafe<
        [{ count: bigint }]
      >(
        `SELECT COUNT(*) as count FROM customers 
         WHERE search_vector @@ plainto_tsquery('english', $1)`,
        search
      );
      const total = Number(totalResult[0].count);

      // Map sortBy to actual column names (handle camelCase to snake_case)
      const columnMap: Record<string, string> = {
        createdAt: "created_at",
        updatedAt: "updated_at",
        firstName: "first_name",
        lastName: "last_name",
        phoneNumber: "phone_number",
      };
      const dbColumnName = columnMap[sortBy] || sortBy;

      // Fetch paginated data with search filter
      // Note: column name and order are validated/mapped, not user input
      const rawData = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT 
          id,
          first_name as "firstName",
          last_name as "lastName",
          email,
          phone_number as "phoneNumber",
          address,
          city,
          state,
          country,
          created_at as "createdAt",
          updated_at as "updatedAt"
         FROM customers 
         WHERE search_vector @@ plainto_tsquery('english', $1)
         ORDER BY ${dbColumnName} ${order}
         LIMIT $2 OFFSET $3`,
        search,
        limit,
        skip
      );

      // Map raw data to Customer type (dates are already Date objects from Prisma)
      const data: Customer[] = rawData.map((row) => ({
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        phoneNumber: row.phoneNumber,
        address: row.address,
        city: row.city,
        state: row.state,
        country: row.country,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }));

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

    // No search - use standard Prisma query
    const total = await this.prisma.customer.count();

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
