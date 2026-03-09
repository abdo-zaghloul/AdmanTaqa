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
import {
  isValidSaudiPhoneDigits,
  toFullSaudiPhone,
  parseDisplayToDigits,
  SAUDI_PHONE_ERROR_MESSAGE,
} from "@/lib/validation/phone";

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
  const [phoneError, setPhoneError] = useState("");

  const initialRoleId = user.roles?.[0]?.id ?? null;
  const initialPhoneDigits = parseDisplayToDigits(user.phone);

  useEffect(() => {
    if (open) {
      setForm({
        fullName: user.fullName,
        phone: initialPhoneDigits,
        email: user.email ?? "",
        roleId: initialRoleId != null ? String(initialRoleId) : "",
      });
      setPhoneError("");
    }
  }, [
    open,
    user.fullName,
    user.phone,
    user.email,
    initialRoleId,
    initialPhoneDigits,
  ]);

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    setForm((p) => ({ ...p, phone: digits }));
    if (digits === "") setPhoneError("");
    else setPhoneError(isValidSaudiPhoneDigits(digits) ? "" : SAUDI_PHONE_ERROR_MESSAGE);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const body: UpdateUserBody = {};
    if (form.fullName.trim() !== user.fullName)
      body.fullName = form.fullName.trim();
    const phoneTrimmed = form.phone.trim();
    const currentPhoneFull = user.phone ? toFullSaudiPhone(initialPhoneDigits) : null;
    const newPhoneFull = phoneTrimmed ? toFullSaudiPhone(phoneTrimmed) : null;
    if (newPhoneFull !== currentPhoneFull) {
      if (phoneTrimmed && !isValidSaudiPhoneDigits(phoneTrimmed)) {
        setPhoneError(SAUDI_PHONE_ERROR_MESSAGE);
        return;
      }
      body.phone = newPhoneFull;
    }
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
            <div className="flex rounded-md border border-input overflow-hidden">
              <span className="inline-flex items-center px-3 text-sm text-muted-foreground border-r border-input bg-muted/30">
                +966
              </span>
              <Input
                id="edit-phone"
                type="tel"
                inputMode="numeric"
                maxLength={9}
                placeholder="501234567"
                value={form.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                aria-invalid={!!phoneError}
              />
            </div>
            {phoneError && <p className="text-xs text-red-600 font-medium">{phoneError}</p>}
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
