/**
 * Customer table component using shadcn/ui Table
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Customer } from "../../types/customer";
import { DeleteCustomerDialog } from "./DeleteCustomerDialog";
import { EditCustomerDialog } from "./EditCustomerDialog";

interface CustomerTableProps {
  customers: Customer[];
}

export function CustomerTable({ customers }: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          No customers found. Create your first customer to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">
                {customer.firstName} {customer.lastName}
              </TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phoneNumber || "-"}</TableCell>
              <TableCell>
                {customer.city && customer.state
                  ? `${customer.city}, ${customer.state}`
                  : customer.city || customer.state || "-"}
              </TableCell>
              <TableCell>
                {new Date(customer.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <EditCustomerDialog customerId={customer.id} />
                  <DeleteCustomerDialog customer={customer} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
