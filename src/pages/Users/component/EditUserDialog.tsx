import { useState, useEffect, useMemo } from "react";
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
import useGetRoles from "@/hooks/Roles/useGetRoles";
import type { UpdateUserBody, UserRoleRef } from "@/types/user";

const STATION_OWNER_ROLE_NAME = "Station Owner";

type EditUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: number | string;
    fullName: string;
    phone?: string | null;
    email?: string;
    roles?: UserRoleRef[];
  };
};

export default function EditUserDialog({
  open,
  onOpenChange,
  user,
}: EditUserDialogProps) {
  const updateMutation = useUpdateUser();
  const { data: allRoles = [], isLoading: rolesLoading } = useGetRoles();

  const assignableRoles = useMemo(
    () =>
      allRoles.filter(
        (r) =>
          r.name.trim().toLowerCase() !== STATION_OWNER_ROLE_NAME.toLowerCase()
      ),
    [allRoles]
  );

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    roleId: "" as string,
  });

  const initialRoleId = user.roles?.[0]?.id ?? null;

  useEffect(() => {
    if (open) {
      setForm({
        fullName: user.fullName,
        phone: user.phone ?? "",
        email: user.email ?? "",
        roleId: initialRoleId != null ? String(initialRoleId) : "",
      });
    }
  }, [
    open,
    user.fullName,
    user.phone,
    user.email,
    initialRoleId,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const body: UpdateUserBody = {};
    if (form.fullName.trim() !== user.fullName)
      body.fullName = form.fullName.trim();
    if ((form.phone.trim() || null) !== (user.phone ?? null))
      body.phone = form.phone.trim() || null;
    if ((form.email.trim() || "") !== (user.email ?? ""))
      body.email = form.email.trim() || undefined;
    const newRoleId =
      form.roleId === "" ? null : Number(form.roleId);
    const currentRoleId = user.roles?.[0]?.id ?? null;
    if (newRoleId !== currentRoleId) body.roleId = newRoleId;

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
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              placeholder="user@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-role">Role</Label>
            <Select
              value={form.roleId || "none"}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, roleId: v === "none" ? "" : v }))
              }
            >
              <SelectTrigger id="edit-role">
                <SelectValue
                  placeholder={
                    rolesLoading ? "Loading roles..." : "Select role"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No role</SelectItem>
                {assignableRoles.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
