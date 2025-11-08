/**
 * Delete customer confirmation dialog
 */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteCustomer } from "../../hooks/useCustomers";
import type { Customer } from "../../types/customer";

interface DeleteCustomerDialogProps {
  customer: Customer;
}

export function DeleteCustomerDialog({ customer }: DeleteCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteCustomer = useDeleteCustomer();

  const handleDelete = () => {
    deleteCustomer.mutate(customer.id, {
      onSuccess: () => {
        toast.success("Customer deleted successfully", {
          description: `${customer.firstName} ${customer.lastName} has been removed from your CRM.`,
        });
        setOpen(false);
      },
      onError: (error) => {
        toast.error("Failed to delete customer", {
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
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Customer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {customer.firstName} {customer.lastName}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleteCustomer.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteCustomer.isPending}
          >
            {deleteCustomer.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
