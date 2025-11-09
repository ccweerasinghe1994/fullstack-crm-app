/**
 * Create customer dialog component
 */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateCustomer } from "../../hooks/useCustomers";
import type { CreateCustomerInput } from "../../types/customer";
import { CreateCustomerForm } from "./CreateCustomerForm";

export function CreateCustomerDialog() {
  const [open, setOpen] = useState(false);
  const createCustomer = useCreateCustomer();

  const handleSubmit = (data: CreateCustomerInput) => {
    createCustomer.mutate(data, {
      onSuccess: (customer) => {
        toast.success("Customer created successfully", {
          description: `${customer.firstName} ${customer.lastName} has been added to your CRM.`,
        });
        setOpen(false);
      },
      onError: (error) => {
        toast.error("Failed to create customer", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Customer</DialogTitle>
          <DialogDescription>
            Add a new customer to your CRM system. Fill in the required fields
            below.
          </DialogDescription>
        </DialogHeader>
        <CreateCustomerForm
          onSubmit={handleSubmit}
          isPending={createCustomer.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
