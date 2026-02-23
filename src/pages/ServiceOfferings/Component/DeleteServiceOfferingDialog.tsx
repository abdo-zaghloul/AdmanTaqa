import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useDeleteServiceOffering from "@/hooks/ServiceOfferings/useDeleteServiceOffering";
import type { ServiceOffering } from "@/types/organization";

type DeleteServiceOfferingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: number | null | undefined;
  offering: ServiceOffering | null;
};

export default function DeleteServiceOfferingDialog({
  open,
  onOpenChange,
  organizationId,
  offering,
}: DeleteServiceOfferingDialogProps) {
  const deleteMutation = useDeleteServiceOffering();

  const handleDelete = () => {
    if (!organizationId || !offering) return;
    deleteMutation.mutate(
      { organizationId, offeringId: offering.id },
      {
        onSuccess: () => {
          toast.success("Service offering deleted.");
          onOpenChange(false);
        },
        onError: (err) =>
          toast.error((err as Error)?.message ?? "Failed to delete offering."),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Service Offering</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete offering #{offering?.id}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
