/**
 * TanStack Query hooks for customer data fetching and mutations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPost, apiPut } from "../lib/api-client";
import type {
  CreateCustomerInput,
  CustomerListResponse,
  CustomerResponse,
  DeleteCustomerResponse,
  UpdateCustomerInput,
} from "../types/customer";

// Query keys
export const CUSTOMER_KEYS = {
  all: ["customers"] as const,
  lists: () => [...CUSTOMER_KEYS.all, "list"] as const,
  list: () => [...CUSTOMER_KEYS.lists()] as const,
  details: () => [...CUSTOMER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CUSTOMER_KEYS.details(), id] as const,
};

/**
 * Fetch all customers
 */
export function useCustomers() {
  return useQuery({
    queryKey: CUSTOMER_KEYS.list(),
    queryFn: async () => {
      const response = await apiGet<CustomerListResponse>("/api/customers");
      return response;
    },
  });
}

/**
 * Fetch a single customer by ID
 */
export function useCustomer(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: CUSTOMER_KEYS.detail(id),
    queryFn: async () => {
      const response = await apiGet<CustomerResponse>(`/api/customers/${id}`);
      return response.data;
    },
    enabled: options?.enabled ?? !!id,
  });
}

/**
 * Create a new customer
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCustomerInput) => {
      const response = await apiPost<CustomerResponse, CreateCustomerInput>(
        "/api/customers",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.lists() });
    },
  });
}

/**
 * Update an existing customer
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCustomerInput;
    }) => {
      const response = await apiPut<CustomerResponse, UpdateCustomerInput>(
        `/api/customers/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (updatedCustomer) => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.lists() });
      // Update the specific customer in cache
      queryClient.invalidateQueries({
        queryKey: CUSTOMER_KEYS.detail(updatedCustomer.id),
      });
    },
  });
}

/**
 * Delete a customer
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiDelete<DeleteCustomerResponse>(
        `/api/customers/${id}`
      );
      return response;
    },
    onSuccess: (_data, deletedId) => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.lists() });
      // Remove the specific customer from cache
      queryClient.removeQueries({ queryKey: CUSTOMER_KEYS.detail(deletedId) });
    },
  });
}
