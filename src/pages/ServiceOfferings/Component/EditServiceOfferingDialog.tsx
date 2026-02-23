import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useUpdateServiceOffering from "@/hooks/ServiceOfferings/useUpdateServiceOffering";
import type { ServiceOffering } from "@/types/organization";

type EditServiceOfferingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: number | null | undefined;
  offering: ServiceOffering | null;
};

export default function EditServiceOfferingDialog({
  open,
  onOpenChange,
  organizationId,
  offering,
}: EditServiceOfferingDialogProps) {
  const updateMutation = useUpdateServiceOffering();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    if (!offering) return;
    setAmount(String(offering.amount));
    setCurrency(offering.currency || "USD");
  }, [offering]);

  const handleUpdate = () => {
    if (!organizationId || !offering) return;
    const body: { amount?: number; currency?: string } = {};
    const amountNum = Number(amount);
    if (
      amount.trim() !== "" &&
      Number.isFinite(amountNum) &&
      amountNum > 0 &&
      amountNum !== Number(offering.amount)
    ) {
      body.amount = amountNum;
    }
    if (currency.trim() && currency !== offering.currency) {
      body.currency = currency.trim().toUpperCase();
    }

    if (Object.keys(body).length === 0) {
      toast.info("No changes to update.");
      return;
    }

    updateMutation.mutate(
      { organizationId, offeringId: offering.id, body },
      {
        onSuccess: () => {
          toast.success("Service offering updated.");
          onOpenChange(false);
        },
        onError: (err) =>
          toast.error((err as Error)?.message ?? "Failed to update offering."),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Service Offering</DialogTitle>
          <DialogDescription>
            You can update amount and currency only.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            maxLength={3}
            placeholder="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
