import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export type LocationLevel = "country" | "governorate" | "city" | "area";

export interface LocationFormValues {
  name: string;
  code?: string;
}

const levelLabels: Record<LocationLevel, string> = {
  country: "Country",
  governorate: "Governorate",
  city: "City",
  area: "Area",
};

type LocationFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  level: LocationLevel;
  initialValues?: LocationFormValues;
  onSubmit: (values: LocationFormValues) => void;
  submitting: boolean;
};

export default function LocationFormDialog({
  open,
  onOpenChange,
  mode,
  level,
  // initialValues,
  onSubmit,
  submitting,
}: LocationFormDialogProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  // useEffect(() => {
  //   if (open) {
  //     setName(initialValues?.name ?? "");
  //     setCode(initialValues?.code ?? "");
  //   }
  // }, [open, initialValues?.name, initialValues?.code]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), code: code.trim() || undefined });
  };

  const label = levelLabels[level];
  const title = mode === "create" ? `Add ${label}` : `Edit ${label}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? `Create a new ${label.toLowerCase()}.` : `Update ${label.toLowerCase()} name and code.`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="loc-name">Name *</Label>
            <Input
              id="loc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={label === "Country" ? "Egypt" : label === "Governorate" ? "Cairo" : "Nasr City"}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loc-code">Code (optional)</Label>
            <Input
              id="loc-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. EG, CAI"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !name.trim()}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === "create" ? "Create" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
