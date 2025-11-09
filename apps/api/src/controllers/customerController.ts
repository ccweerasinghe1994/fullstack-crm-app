import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
import type {
  CreateCustomerInput,
  CustomerModel,
  UpdateCustomerInput,
} from "../models/customer.model";
import type { CustomerService } from "../services/customer.service";
import type { PaginationMeta } from "../types/pagination.types";

/**
 * Generic API error response
 */
interface ApiError {
  success: false;
  error: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
}

/**
 * Response with list of customers
 */
interface CustomerListResponse {
  success: true;
  data: CustomerModel[];
  count: number;
}

/**
 * Response with paginated list of customers
 */
interface PaginatedCustomerListResponse {
  success: true;
  data: CustomerModel[];
  meta: PaginationMeta;
}

/**
 * Response with single customer
 */
interface CustomerResponse {
  success: true;
  data: CustomerModel;
}

/**
 * Response with customer count
 */
interface CustomerCountResponse {
  success: true;
  data: { count: number };
}

/**
 * Response with success message
 */
interface MessageResponse {
  success: true;
  message: string;
}

@Route("api/customers")
@Tags("Customers")
export class CustomerController extends Controller {
  constructor(private customerService: CustomerService) {
    super();
  }

  /**
   * Retrieves all customers from the database with pagination
   * @summary Get all customers (paginated)
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 10)
   * @param sortBy Field to sort by (default: createdAt)
   * @param order Sort order (default: desc)
   * @param search Full-text search query across all customer fields
   */
  @Get()
  @SuccessResponse("200", "Successfully retrieved customers")
  public async getAllCustomers(
    @Query() page?: number,
    @Query() limit?: number,
    @Query() sortBy?: string,
    @Query() order?: "asc" | "desc",
    @Query() search?: string
  ): Promise<PaginatedCustomerListResponse> {
    const result = await this.customerService.getAllCustomersPaginated({
      page,
      limit,
      sortBy,
      order,
      search,
    });
    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  }

  /**
   * Retrieves the total count of customers
   * @summary Get customer count
   */
  @Get("count")
  @SuccessResponse("200", "Successfully retrieved count")
  public async getCustomerCount(): Promise<CustomerCountResponse> {
    const count = await this.customerService.getCustomerCount();
    return {
      success: true,
      data: { count },
    };
  }

  /**
   * Retrieves a single customer by ID
   * @summary Get customer by ID
   * @param customerId The customer's unique identifier
   */
  @Get("{customerId}")
  @SuccessResponse("200", "Successfully retrieved customer")
  @Response<ApiError>("404", "Customer not found")
  public async getCustomerById(
    @Path() customerId: string
  ): Promise<CustomerResponse> {
    const customer = await this.customerService.getCustomerById(customerId);
    return {
      success: true,
      data: customer,
    };
  }

  /**
   * Creates a new customer
   * @summary Create customer
   * @param requestBody Customer data
   */
  @Post()
  @SuccessResponse("201", "Customer created successfully")
  @Response<ApiError>("400", "Validation error")
  @Response<ApiError>("409", "Customer with email already exists")
  public async createCustomer(
    @Body() requestBody: CreateCustomerInput
  ): Promise<CustomerResponse> {
    const customer = await this.customerService.createCustomer(requestBody);
    this.setStatus(201);
    return {
      success: true,
      data: customer,
    };
  }

  /**
   * Updates an existing customer
   * @summary Update customer
   * @param customerId The customer's unique identifier
   * @param requestBody Updated customer data
   */
  @Put("{customerId}")
  @SuccessResponse("200", "Customer updated successfully")
  @Response<ApiError>("404", "Customer not found")
  @Response<ApiError>("409", "Email already in use")
  public async updateCustomer(
    @Path() customerId: string,
    @Body() requestBody: UpdateCustomerInput
  ): Promise<CustomerResponse> {
    const customer = await this.customerService.updateCustomer(
      customerId,
      requestBody
    );
    return {
      success: true,
      data: customer as CustomerModel,
    };
  }

  /**
   * Deletes a customer
   * @summary Delete customer
   * @param customerId The customer's unique identifier
   */
  @Delete("{customerId}")
  @SuccessResponse("200", "Customer deleted successfully")
  @Response<ApiError>("404", "Customer not found")
  public async deleteCustomer(
    @Path() customerId: string
  ): Promise<MessageResponse> {
    await this.customerService.deleteCustomer(customerId);
    return {
      success: true,
      message: "Customer deleted successfully",
    };
  }
}
