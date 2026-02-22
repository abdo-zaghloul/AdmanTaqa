import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUpdateUser from "@/hooks/Users/useUpdateUser";
import type { UpdateUserBody } from "@/types/user";

type EditUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: number | string;
    fullName: string;
    phone?: string | null;
    isActive?: boolean;
  };
};

export default function EditUserDialog({
  open,
  onOpenChange,
  user,
}: EditUserDialogProps) {
  const updateMutation = useUpdateUser();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    isActive: "true",
    password: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        fullName: user.fullName,
        phone: user.phone ?? "",
        isActive: user.isActive === false ? "false" : "true",
        password: "",
      });
    }
  }, [open, user.fullName, user.phone, user.isActive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const body: UpdateUserBody = {};
    if (form.fullName.trim() !== user.fullName)
      body.fullName = form.fullName.trim();
    if ((form.phone.trim() || null) !== (user.phone ?? null))
      body.phone = form.phone.trim() || null;
    const newActive = form.isActive === "true";
    if (newActive !== (user.isActive !== false)) body.isActive = newActive;
    if (form.password.trim()) body.password = form.password.trim();

    if (Object.keys(body).length === 0) {
      toast.info("No changes to save.");
      return;
    }

    updateMutation.mutate(
      { id: user.id, body },
      {
        onSuccess: () => {
          toast.success("User updated successfully.");
          onOpenChange(false);
        },
        onError: (e) =>
          toast.error((e as Error)?.message ?? "Failed to update user."),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information. Only changed fields will be sent.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-fullName">Full Name</Label>
            <Input
              id="edit-fullName"
              value={form.fullName}
              onChange={(e) =>
                setForm((p) => ({ ...p, fullName: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input
              id="edit-phone"
              placeholder="+966..."
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-isActive">Status</Label>
            <Select
              value={form.isActive}
              onValueChange={(v) => setForm((p) => ({ ...p, isActive: v }))}
            >
              <SelectTrigger id="edit-isActive">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-password">
              New Password{" "}
              <span className="text-muted-foreground font-normal">
                (leave empty to keep current)
              </span>
            </Label>
            <Input
              id="edit-password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
            />
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
