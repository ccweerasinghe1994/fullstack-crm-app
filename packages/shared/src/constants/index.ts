// Shared constants and enums

export const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
  CUSTOMERS: "/api/customers",
  CUSTOMER_BY_ID: (id: string) => `/api/customers/${id}`,
} as const;

