import { z } from "zod";

// Customer Account Validation Schema
export const customerSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createCustomerSchema = customerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCustomerSchema = customerSchema
  .partial()
  .required({ id: true });

export type Customer = z.infer<typeof customerSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
