import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useDeactivateUser from "@/hooks/Users/useDeactivateUser";

type DeactivateUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: number | string; fullName: string } | null;
};

export default function DeactivateUserDialog({
  open,
  onOpenChange,
  user,
}: DeactivateUserDialogProps) {
  const deactivateMutation = useDeactivateUser();

  const handleDeactivate = () => {
    if (!user) return;
    deactivateMutation.mutate(user.id, {
      onSuccess: () => {
        toast.success("User deactivated.");
        onOpenChange(false);
      },
      onError: (e) =>
        toast.error((e as Error)?.message ?? "Failed to deactivate user."),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deactivate User</DialogTitle>
          <DialogDescription>
            Are you sure you want to deactivate &quot;{user?.fullName}&quot;? They will no longer be able to sign in. This can be reversed by an admin (Edit user → set Active).
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeactivate}
            disabled={deactivateMutation.isPending}
          >
            {deactivateMutation.isPending ? "Deactivating..." : "Deactivate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
