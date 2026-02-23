import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import useGetRolePermissions from "@/hooks/Roles/useGetRolePermissions";
import useCreateRole from "@/hooks/Roles/useCreateRole";

export default function CreateCustomRole() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
    const { data: permissions = [], isLoading: permissionsLoading } = useGetRolePermissions();
    const createMutation = useCreateRole();

    const permissionItems = useMemo(
        () => permissions.filter((p) => typeof p.id === "number" && p.id > 0),
        [permissions]
    );

    const handleCreateRole = (e: FormEvent) => {
        e.preventDefault();
        createMutation.mutate(
            {
                name,
                description: description || undefined,
                permissionIds: selectedPermissionIds,
            },
            {
                onSuccess: () => {
                    toast.success("Role created successfully!");
                    navigate('/roles');
                },
                onError: (err) => {
                    toast.error(err instanceof Error ? err.message : "Failed to create role.");
                },
            }
        );
    };

    const togglePermission = (permissionId: number) => {
        setSelectedPermissionIds((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in slide-in-from-right duration-500 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/roles')}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Custom Role</h1>
                    <p className="text-muted-foreground">
                        Define a new role with specific permissions and access levels.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Role Details</CardTitle>
                    <CardDescription>Enter the basic information for this role.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="create-role-form" onSubmit={handleCreateRole} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="roleName">Role Name</Label>
                                <Input
                                    id="roleName"
                                    placeholder="e.g., Compliance Officer"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the responsibilities and access scope..."
                                    className="min-h-[80px]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Permissions</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-slate-50/50">
                                {permissionsLoading ? (
                                    <p className="text-sm text-muted-foreground">Loading permissions...</p>
                                ) : permissionItems.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No assignable permissions were returned from API.
                                    </p>
                                ) : (
                                    permissionItems.map((permission) => (
                                        <div key={permission.id} className="flex items-start space-x-2">
                                            <Checkbox
                                                id={`perm-${permission.id}`}
                                                checked={selectedPermissionIds.includes(permission.id)}
                                                onCheckedChange={() => togglePermission(permission.id)}
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <Label htmlFor={`perm-${permission.id}`} className="text-sm font-medium leading-none">
                                                    {permission.name || permission.code}
                                                </Label>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {permission.description || permission.code}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => navigate('/roles')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending}>
                                {createMutation.isPending ? "Creating..." : "Create Role"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
