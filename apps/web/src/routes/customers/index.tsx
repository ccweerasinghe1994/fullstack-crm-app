import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { createColumns } from "../../components/customers/columns";
import { CreateCustomerDialog } from "../../components/customers/CreateCustomerDialog";
import { CustomerTableSkeleton } from "../../components/customers/CustomerTableSkeleton";
import { DataTable } from "../../components/customers/data-table";
import { DeleteCustomerDialog } from "../../components/customers/DeleteCustomerDialog";
import { EditCustomerDialog } from "../../components/customers/EditCustomerDialog";
import { useCustomersPaginated } from "../../hooks/useCustomers";
import type { Customer } from "../../types/customer";
import type { PaginationParams } from "../../types/pagination";

export const Route = createFileRoute("/customers/")({
  component: CustomersPage,
});

function CustomersPage() {
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(
    null
  );
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    order: "desc",
  });

  const { data, isLoading, error } = useCustomersPaginated(pagination);

  const columns = createColumns({
    onEdit: (customer) => setEditingCustomer(customer),
    onDelete: (customer) => setDeletingCustomer(customer),
  });

  return (
    <div className="container mx-auto py-6 px-4 sm:py-10">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Customers
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Manage your customer accounts and information
            </p>
          </div>
          <CreateCustomerDialog />
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load customers"}
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <CustomerTableSkeleton />
        ) : data ? (
          <DataTable
            columns={columns}
            data={data.data}
            meta={data.meta}
            pagination={pagination}
            onPaginationChange={setPagination}
            searchKey="email"
            searchPlaceholder="Search by email..."
          />
        ) : null}
      </div>

      <EditCustomerDialog
        customerId={editingCustomer?.id || ""}
        open={!!editingCustomer}
        onOpenChange={(open) => !open && setEditingCustomer(null)}
      />

      <DeleteCustomerDialog
        customer={deletingCustomer}
        open={!!deletingCustomer}
        onOpenChange={(open) => !open && setDeletingCustomer(null)}
      />
    </div>
  );
}
