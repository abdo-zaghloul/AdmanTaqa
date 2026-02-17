import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { OnboardingItem } from "@/types/onboarding";

type DeleteOnboardingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: OnboardingItem | null;
  onConfirm: () => void;
  onCancel: () => void;
  submitting: boolean;
};

export default function DeleteOnboardingDialog({
  open,
  // onOpenChange,
  item,
  onConfirm,
  onCancel,
  submitting,
}: DeleteOnboardingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete onboarding item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{item?.title}&quot;? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={!item || submitting}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
