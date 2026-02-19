import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import UsersTableCardContent from "./component/UsersTableCardContent";
import CreateUserDialog from "./component/CreateUserDialog";
import type { UserRow } from "./component/UsersTableCardContent";
import useGetUsers from "@/hooks/Users/useGetUsers";
import type { ApiUser } from "@/types/user";

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

  const { data, isLoading, isError, error } = useGetUsers();
  const users = useMemo(() => data?.data ?? [], [data?.data]);
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

  const handleDeleteUser = () => {
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
        <CreateUserDialog />
      </div>
      {/* {console.log(isError, error)} */}

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
