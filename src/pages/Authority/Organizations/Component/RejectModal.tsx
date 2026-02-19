import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type RejectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgName: string;
  isPending: boolean;
  onSubmit: (reason?: string) => void;
};

export default function RejectModal({
  open,
  onOpenChange,
  orgName,
  isPending,
  onSubmit,
}: RejectModalProps) {
  const [reason, setReason] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (!next) setReason("");
    onOpenChange(next);
  };

  const handleSubmit = () => {
    onSubmit(reason.trim() || undefined);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reject Organization</DialogTitle>
          <DialogDescription>
            Optionally provide a reason for rejecting &quot;{orgName}&quot;. The
            reason may be shown to the organization.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="org-reject-reason">Reason (optional)</Label>
            <Textarea
              id="org-reject-reason"
              placeholder="e.g. Incomplete documents, missing information..."
              className="min-h-[100px]"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Rejecting..." : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
