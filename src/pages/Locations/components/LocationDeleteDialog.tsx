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
import type { LocationLevel } from "./LocationFormDialog";

const levelLabels: Record<LocationLevel, string> = {
  country: "Country",
  governorate: "Governorate",
  city: "City",
  area: "Area",
};

type LocationDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: LocationLevel;
  itemName: string;
  onConfirm: () => void;
  submitting: boolean;
};

export default function LocationDeleteDialog({
  open,
  onOpenChange,
  level,
  itemName,
  onConfirm,
  submitting,
}: LocationDeleteDialogProps) {
  const label = levelLabels[level];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete {label}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{itemName}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
