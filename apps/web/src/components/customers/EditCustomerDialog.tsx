/**
 * Edit customer dialog component
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
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCustomer, useUpdateCustomer } from "../../hooks/useCustomers";
import type { UpdateCustomerInput } from "../../types/customer";
import { EditCustomerForm } from "./EditCustomerForm";

interface EditCustomerDialogProps {
  customerId: string;
}

export function EditCustomerDialog({ customerId }: EditCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: customer, isLoading } = useCustomer(customerId);
  const updateCustomer = useUpdateCustomer();

  const handleSubmit = (data: UpdateCustomerInput) => {
    // Remove id from data if it exists (id comes from path parameter, not body)
    const { id: _id, ...dataWithoutId } = data as any;
    
    updateCustomer.mutate(
      { id: customerId, data: dataWithoutId },
      {
        onSuccess: (updatedCustomer) => {
          toast.success("Customer updated successfully", {
            description: `${updatedCustomer.firstName} ${updatedCustomer.lastName}'s information has been updated.`,
          });
          setOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to update customer", {
            description:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred.",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>
            Update customer information below. All changes will be saved
            immediately.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : customer ? (
          <EditCustomerForm
            customer={customer}
            onSubmit={handleSubmit}
            isPending={updateCustomer.isPending}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Failed to load customer data.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
