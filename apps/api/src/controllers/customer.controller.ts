import type { CreateCustomerInput } from "@crm/shared";
import type { Request, Response } from "express";
import type { CustomerService } from "../services/customer.service";

export class CustomerController {
  constructor(private customerService: CustomerService) {}

  async getAllCustomers(_req: Request, res: Response): Promise<void> {
    const customers = await this.customerService.getAllCustomers();
    res.status(200).json({
      success: true,
      data: customers,
      count: customers.length,
    });
  }

  async getCustomerById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const customer = await this.customerService.getCustomerById(id);
    res.status(200).json({
      success: true,
      data: customer,
    });
  }

  async createCustomer(req: Request, res: Response): Promise<void> {
    const input: CreateCustomerInput = req.body;
    const customer = await this.customerService.createCustomer(input);
    res.status(201).json({
      success: true,
      data: customer,
      message: "Customer created successfully",
    });
  }

  async updateCustomer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const input: Partial<CreateCustomerInput> = req.body;
    const customer = await this.customerService.updateCustomer(id, input);
    res.status(200).json({
      success: true,
      data: customer,
      message: "Customer updated successfully",
    });
  }

  async deleteCustomer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.customerService.deleteCustomer(id);
    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  }

  async getCustomerCount(_req: Request, res: Response): Promise<void> {
    const count = await this.customerService.getCustomerCount();
    res.status(200).json({
      success: true,
      data: { count },
    });
  }
}
