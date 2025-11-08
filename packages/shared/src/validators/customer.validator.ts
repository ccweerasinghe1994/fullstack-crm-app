import { z } from "zod";

// Customer Account Validation Schema
export const customerSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  dateCreated: z.date().optional(),
});

export const createCustomerSchema = customerSchema.omit({ id: true, dateCreated: true });

export const updateCustomerSchema = customerSchema.partial().required({ id: true });

export type Customer = z.infer<typeof customerSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

