/**
 * Customer types for the frontend
 * Re-exports from @crm/shared and adds API-specific response types
 */

import type {
  CreateCustomerInput as SharedCreateCustomerInput,
  Customer as SharedCustomer,
  UpdateCustomerInput as SharedUpdateCustomerInput,
} from "@crm/shared/validators";

// Re-export shared types
export type Customer = SharedCustomer;
export type CreateCustomerInput = SharedCreateCustomerInput;
export type UpdateCustomerInput = SharedUpdateCustomerInput;

// API Response types
export interface CustomerListResponse {
  success: true;
  data: Customer[];
  count: number;
}

export interface CustomerResponse {
  success: true;
  data: Customer;
}

export interface CustomerCountResponse {
  success: true;
  data: { count: number };
}

export interface DeleteCustomerResponse {
  success: true;
  message: string;
}
