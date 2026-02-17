import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

export default function CreateCustomRole() {
    const navigate = useNavigate();

    const handleCreateRole = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Role created successfully!");
        navigate('/roles');
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
                                <Input id="roleName" placeholder="e.g., Compliance Officer" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the responsibilities and access scope..."
                                    className="min-h-[80px]"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Permissions</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-slate-50/50">
                                <div className="flex items-start space-x-2">
                                    <Checkbox id="perm-users" />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="perm-users" className="text-sm font-medium leading-none">User Management</Label>
                                        <p className="text-[10px] text-muted-foreground">View, create, and edit users</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <Checkbox id="perm-branches" />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="perm-branches" className="text-sm font-medium leading-none">Branch Operations</Label>
                                        <p className="text-[10px] text-muted-foreground">Manage branches and details</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <Checkbox id="perm-requests" />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="perm-requests" className="text-sm font-medium leading-none">Service Requests</Label>
                                        <p className="text-[10px] text-muted-foreground">Submit and track requests</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <Checkbox id="perm-finance" />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="perm-finance" className="text-sm font-medium leading-none">Financial Access</Label>
                                        <p className="text-[10px] text-muted-foreground">View quotations and invoices</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => navigate('/roles')}>
                                Cancel
                            </Button>
                            <Button type="submit">Create Role</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
