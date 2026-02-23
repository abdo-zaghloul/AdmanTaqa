import RoleCardsGrid from "./Component/RoleCardsGrid";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import useGetRoles from "@/hooks/Roles/useGetRoles";

export default function Roles() {
  const navigate = useNavigate();
  const { data: roles = [], isLoading, isError, error } = useGetRoles();

  const handleDeleteConfirm = (role: { id: string; name: string }) => {
    toast.error(
      `Delete endpoint is not available on /api/roles yet for "${role.name}".`
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in slide-in-from-right duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground">
            Define access levels and assign permissions to different user categories.
          </p>
        </div>
        <Button className="gap-2 shadow-lg" onClick={() => navigate("/roles/create")}>
          <Plus className="h-4 w-4" />
          Create Custom Role
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-lg border bg-card p-8 text-sm text-muted-foreground">
          Loading roles...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load roles."}
        </div>
      ) : (
        <RoleCardsGrid
          roles={roles.map((role) => ({
            id: String(role.id),
            name: role.name,
            description: role.description ?? "",
            permissions: role.permissions ?? [],
            userCount: role.userCount ?? 0,
            type: role.type ?? "ORGANIZATION",
          }))}
          onDeleteConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
