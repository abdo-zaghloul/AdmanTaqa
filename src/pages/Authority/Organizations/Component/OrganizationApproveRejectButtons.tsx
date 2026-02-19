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
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle } from "lucide-react";
import type { OrganizationProfile } from "@/types/organization";

type OrganizationApproveRejectButtonsProps = {
  organization: OrganizationProfile;
  onApprove: (id: number | string) => void;
  onReject: (id: number | string, reason?: string) => void;
  isPending?: boolean;
};

export default function OrganizationApproveRejectButtons({
  organization,
  onApprove,
  onReject,
  isPending = false,
}: OrganizationApproveRejectButtonsProps) {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleRejectClick = () => {
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = () => {
    onReject(organization.id, rejectReason.trim() || undefined);
    setRejectModalOpen(false);
    setRejectReason("");
  };

  if (organization.status !== "PENDING") return null;

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleRejectClick}
          disabled={isPending}
        >
          <XCircle className="h-3.5 w-3.5" />
          Reject
        </Button>
        <Button
          size="sm"
          className="h-8 gap-1.5 bg-green-600 hover:bg-green-700"
          onClick={() => onApprove(organization.id)}
          disabled={isPending}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Approve
        </Button>
      </div>

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Reject Organization</DialogTitle>
            <DialogDescription>
              Optionally provide a reason for rejecting &quot;{organization.name}&quot;. The reason may be shown to the organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="reject-reason">Reason (optional)</Label>
            <Input
              id="reject-reason"
              placeholder="e.g. Incomplete documents"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectSubmit} disabled={isPending}>
              {isPending ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
