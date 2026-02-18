import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import UsersTableCardContent from "./component/UsersTableCardContent";
import type { UserRow } from "./component/UsersTableCardContent";
import useGetUsers from "@/hooks/Users/useGetUsers";
import useCreateUser from "@/hooks/Users/useCreateUser";
import type { CreateUserBody, ApiUser } from "@/types/user";

function toUserRow(u: ApiUser): UserRow {
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone ?? "",
    role: u.role,
    orgName: u.organization?.name,
    status: u.isActive === false ? "INACTIVE" : "ACTIVE",
  };
}

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserBody>({
    email: "",
    fullName: "",
    password: "",
    phone: "",
  });

  const { data, isLoading, isError, error } = useGetUsers();
  const createMutation = useCreateUser();
  const users = data?.data ?? [];
  const rows = useMemo(() => users.map(toUserRow), [users]);
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const list = q
      ? rows.filter(
          (u) =>
            u.fullName.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            String(u.id).toLowerCase().includes(q)
        )
      : rows;
    return roleFilter === "all" ? list : list.filter((u) => u.role === roleFilter);
  }, [rows, searchQuery, roleFilter]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const body: CreateUserBody = {
      email: createForm.email.trim(),
      fullName: createForm.fullName.trim(),
      password: createForm.password,
      phone: createForm.phone?.trim() || undefined,
    };
    createMutation.mutate(body, {
      onSuccess: () => {
        toast.success("User created successfully.");
        setIsCreateModalOpen(false);
        setCreateForm({ email: "", fullName: "", password: "", phone: "" });
      },
      onError: (e) => toast.error((e as Error)?.message ?? "Failed to create user."),
    });
  };

  const handleDeleteUser = (_user: UserRow) => {
    toast.info("Delete user is not implemented in the API. Use team/deactivate if available.");
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts in your organization.
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm">
              <UserPlus className="h-4 w-4" />
              Create New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to your organization. Body: email, fullName, password, phone (optional).
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={createForm.fullName}
                    onChange={(e) => setCreateForm((p) => ({ ...p, fullName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={createForm.password}
                  onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  placeholder="+966..."
                  value={createForm.phone ?? ""}
                  onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          Loading users...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-destructive">
          {(error as Error)?.message ?? "Failed to load users."}
        </div>
      ) : (
        <Card className="border-none shadow-xl bg-card/70 backdrop-blur-md">
          <CardHeader className="pb-3 px-6 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  className="pl-10 bg-background/50 border-muted-foreground/10 focus-visible:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                  <Filter className="h-4 w-4" />
                  Role:
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px] bg-background/50 border-muted-foreground/10">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="AUTHORITY">Authority</SelectItem>
                    <SelectItem value="SERVICE_PROVIDER">Service Provider</SelectItem>
                    <SelectItem value="BRANCH_MANAGER">Branch Manager</SelectItem>
                    <SelectItem value="TECHNICIAN">Technician</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <UsersTableCardContent users={filteredUsers} onDeleteConfirm={handleDeleteUser} />
        </Card>
      )}
    </div>
  );
}
