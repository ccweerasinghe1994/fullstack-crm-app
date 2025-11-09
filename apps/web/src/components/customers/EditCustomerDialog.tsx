/**
 * Edit customer dialog component
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { useCustomer, useUpdateCustomer } from "../../hooks/useCustomers";
import type { UpdateCustomerInput } from "../../types/customer";
import { EditCustomerForm } from "./EditCustomerForm";

interface EditCustomerDialogProps {
  customerId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditCustomerDialog({
  customerId,
  open: controlledOpen,
  onOpenChange,
}: EditCustomerDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const { data: customer, isLoading } = useCustomer(customerId, {
    enabled: !!customerId && open,
  });
  const updateCustomer = useUpdateCustomer();

  if (!customerId) return null;

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
