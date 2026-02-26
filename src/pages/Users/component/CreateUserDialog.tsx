import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { UserPlus } from "lucide-react";
import useCreateUser from "@/hooks/Users/useCreateUser";
import useGetRoles from "@/hooks/Roles/useGetRoles";
import type { CreateUserBody } from "@/types/user";

type CreateUserForm = {
  email: string;
  fullName: string;
  password: string;
  phone?: string;
  roleId: string;
};

const initialForm: CreateUserForm = {
  email: "",
  fullName: "",
  password: "",
  phone: "",
  roleId: "",
};

type CreateUserDialogProps = {
  /** Optional custom trigger; defaults to "Create New User" button */
  trigger?: React.ReactNode;
};

export default function CreateUserDialog({ trigger }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const createMutation = useCreateUser();
  const { data: roles = [], isLoading: rolesLoading } = useGetRoles();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body: CreateUserBody = {
      email: form.email.trim(),
      fullName: form.fullName.trim(),
      password: form.password,
      phone: form.phone?.trim() || undefined,
      roleId: form.roleId ? Number(form.roleId) : undefined,
    };
    createMutation.mutate(body, {
      onSuccess: () => {
        toast.success("User created successfully.");
        setOpen(false);
        setForm(initialForm);
      },
      onError: (e) => toast.error((e as Error)?.message ?? "Failed to create user."),
    });
  };
 
  const handleOpenChange = (next: boolean) => {
    if (!next) setForm(initialForm);
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2 shadow-sm">
            <UserPlus className="h-4 w-4" />
            Create New User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to your organization. You can optionally assign a role during creation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="create-fullName">Full Name</Label>
              <Input
                id="create-fullName"
                placeholder="John Doe"
                value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-password">Password</Label>
            <Input
              id="create-password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-phone">Phone (optional)</Label>
            <Input
              id="create-phone"
              placeholder="+966..."
              value={form.phone ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Role (optional)</Label>
            <Select
              value={form.roleId || "none"}
              onValueChange={(value) =>
                setForm((p) => ({ ...p, roleId: value === "none" ? "" : value }))
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={rolesLoading ? "Loading roles..." : "Select role (optional)"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
