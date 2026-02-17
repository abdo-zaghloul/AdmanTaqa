import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Lock } from "lucide-react";
import React, { useState } from "react";

// Mock Data (In a real app, this would be fetched from an API)
const MOCK_ROLES = [
    {
        id: "ROLE-001",
        name: "Authority Administrator",
        description: "Full system access with approval and management rights over all organizations.",
        permissions: ["organizations:read", "organizations:approve", "users:all", "inspections:create", "audit:read"],
        userCount: 4,
        type: "GLOBAL",
        createdAt: "2024-01-15",
        updatedAt: "2024-02-10",
    },
    {
        id: "ROLE-002",
        name: "Service Provider Manager",
        description: "Manage service provider profile, users, branches, and submit quotations.",
        permissions: ["branches:read", "branches:create", "quotations:submit", "quotations:read", "users:read"],
        userCount: 12,
        type: "ORGANIZATION",
        createdAt: "2024-01-20",
        updatedAt: "2024-02-05",
    },
    {
        id: "ROLE-003",
        name: "Fuel Station Manager",
        description: "Request services for branches and manage station details.",
        permissions: ["branches:all", "requests:create", "requests:read", "job-orders:read"],
        userCount: 28,
        type: "ORGANIZATION",
        createdAt: "2024-01-22",
        updatedAt: "2024-02-08",
    },
    {
        id: "ROLE-004",
        name: "Inspector",
        description: "Access to conduct inspections and view organization compliance documents.",
        permissions: ["inspections:read", "inspections:report", "organizations:read", "documents:view"],
        userCount: 8,
        type: "GLOBAL",
        createdAt: "2024-01-25",
        updatedAt: "2024-02-01",
    },
];

// All available permissions in the system
const ALL_PERMISSIONS = [
    { id: "organizations:read", label: "Organization Read", description: "View organization details" },
    { id: "organizations:approve", label: "Organization Approve", description: "Approve organizations" },
    { id: "users:all", label: "User Management", description: "View, create, and edit users" },
    { id: "users:read", label: "User Read", description: "View user details" },
    { id: "inspections:create", label: "Create Inspections", description: "Create new inspection records" },
    { id: "inspections:read", label: "Read Inspections", description: "View inspection records" },
    { id: "inspections:report", label: "Report Inspections", description: "Generate inspection reports" },
    { id: "branches:read", label: "Branch Read", description: "View branch details" },
    { id: "branches:create", label: "Create Branches", description: "Create new branches" },
    { id: "branches:all", label: "All Branches", description: "Full branch management" },
    { id: "quotations:submit", label: "Submit Quotations", description: "Submit quotation requests" },
    { id: "quotations:read", label: "Read Quotations", description: "View quotations" },
    { id: "requests:create", label: "Create Requests", description: "Create service requests" },
    { id: "requests:read", label: "Read Requests", description: "View service requests" },
    { id: "job-orders:read", label: "Read Job Orders", description: "View job orders" },
    { id: "documents:view", label: "View Documents", description: "Access to view documents" },
    { id: "audit:read", label: "Read Audit Logs", description: "View audit logs" },
];

export default function EditRole() {
    const { id } = useParams();
    const navigate = useNavigate();

    // State to manage form data - moved before any conditional returns
    const [roleData, setRoleData] = useState(() => {
        // Find role by ID or default to empty object
        const foundRole = MOCK_ROLES.find((r) => r.id === id);
        if (foundRole) {
            return {
                found: true,
                role: {
                    name: foundRole.name,
                    description: foundRole.description,
                    type: foundRole.type,
                    permissions: [...foundRole.permissions],
                }
            };
        } else {
            return {
                found: false,
                role: {
                    name: '',
                    description: '',
                    type: 'ORGANIZATION',
                    permissions: [],
                }
            };
        }
    });

    if (!roleData.found) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                <p>Role not found</p>
                <Button variant="link" onClick={() => navigate('/roles')}>Return to Roles</Button>
            </div>
        );
    }

    const role = MOCK_ROLES.find((r) => r.id === id); // Get the original role for displaying stats

    const formData = roleData.role;

    const handlePermissionChange = (permissionId: string) => {
        setRoleData(prevState => {
            const prev = prevState.role;
            if (prev.permissions.includes(permissionId)) {
                return {
                    ...prevState,
                    role: {
                        ...prev,
                        permissions: prev.permissions.filter(p => p !== permissionId)
                    }
                };
            } else {
                return {
                    ...prevState,
                    role: {
                        ...prev,
                        permissions: [...prev.permissions, permissionId]
                    }
                };
            }
        });
    };

    const handleFieldChange = (field: keyof typeof formData, value: string | string[]) => {
        setRoleData(prevState => ({
            ...prevState,
            role: {
                ...prevState.role,
                [field]: value
            }
        }));
    };

    const handleSaveRole = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(`Role "${formData.name}" updated successfully!`);
        navigate('/roles');
    };

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in slide-in-from-right duration-500 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/roles')}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">Edit Role</h1>
                        <Badge variant={role?.type === "GLOBAL" ? "default" : "secondary"} className="ml-2">
                            {role?.type}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">Modify permissions and details for {role?.name}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Role Details</CardTitle>
                    <CardDescription>Update the basic information for this role.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="edit-role-form" onSubmit={handleSaveRole} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="roleName">Role Name</Label>
                                <Input 
                                    id="roleName" 
                                    value={formData.name}
                                    onChange={(e) => handleFieldChange('name', e.target.value)}
                                    placeholder="e.g., Compliance Officer" 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleFieldChange('description', e.target.value)}
                                    placeholder="Describe the responsibilities and access scope..."
                                    className="min-h-[80px]"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Permissions</Label>
                            <p className="text-sm text-muted-foreground">Select the permissions to grant to users with this role.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-slate-50/50">
                                {ALL_PERMISSIONS.map((permission) => (
                                    <div key={permission.id} className="flex items-start space-x-2">
                                        <Checkbox 
                                            id={`perm-${permission.id}`}
                                            checked={formData.permissions.includes(permission.id)}
                                            onCheckedChange={() => handlePermissionChange(permission.id)}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label htmlFor={`perm-${permission.id}`} className="text-sm font-medium leading-none flex items-center gap-1">
                                                <Lock className="h-3 w-3" />
                                                {permission.label}
                                            </Label>
                                            <p className="text-[10px] text-muted-foreground">{permission.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* <div className="space-y-3">
                            <Label className="text-base font-semibold">Role Type</Label>
                            <p className="text-sm text-muted-foreground">Global roles apply system-wide, Organization roles are scoped to specific organizations.</p>
                            <div className="flex gap-4 pt-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id="type-global"
                                        checked={formData.type === "GLOBAL"}
                                        onCheckedChange={() => handleFieldChange('type', "GLOBAL")}
                                    />
                                    <Label htmlFor="type-global" className="text-sm font-medium leading-none">Global Role</Label>
                                    <Badge variant="default" className="ml-2">GLOBAL</Badge>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id="type-org"
                                        checked={formData.type === "ORGANIZATION"}
                                        onCheckedChange={() => handleFieldChange('type', "ORGANIZATION")}
                                    />
                                    <Label htmlFor="type-org" className="text-sm font-medium leading-none">Organization Role</Label>
                                    <Badge variant="secondary" className="ml-2">ORGANIZATION</Badge>
                                </div>
                            </div>
                        </div> */}

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
 
        </div>
    );
}
