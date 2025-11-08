/**
 * Customers list page
 */

import { Alert, AlertDescription, AlertTitle } from "@crm/ui";
import { createFileRoute } from "@tanstack/react-router";
import { CreateCustomerDialog } from "../../components/customers/CreateCustomerDialog";
import { CustomerTable } from "../../components/customers/CustomerTable";
import { CustomerTableSkeleton } from "../../components/customers/CustomerTableSkeleton";
import { useCustomers } from "../../hooks/useCustomers";

export const Route = createFileRoute("/customers/")({
  component: CustomersPage,
});

function CustomersPage() {
  const { data, isLoading, error } = useCustomers();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer accounts and information
          </p>
        </div>
        <CreateCustomerDialog />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load customers. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <CustomerTableSkeleton />
      ) : data ? (
        <CustomerTable customers={data.data} />
      ) : null}
    </div>
  );
}
