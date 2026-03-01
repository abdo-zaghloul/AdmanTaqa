import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ShieldCheck,
    ShieldAlert,
    Users,
    Settings2,
    ChevronLeft,
    Lock,
    History
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import useGetRoleById from "@/hooks/Roles/useGetRoleById";

export default function RoleDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: role, isLoading, isError, error } = useGetRoleById(id);

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            {isLoading ? (
                <div className="p-8 text-sm text-muted-foreground">Loading role details...</div>
            ) : isError || !role ? (
                <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                    <p>{error instanceof Error ? error.message : "Role not found"}</p>
                    <Button variant="link" onClick={() => navigate('/roles')}>Return to Roles</Button>
                </div>
            ) : (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/roles')}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">{role.name}</h1>
                        <Badge variant={role.type === "GLOBAL" ? "default" : "secondary"} className="ml-2">
                            {role.type ?? "ORGANIZATION"}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">{role.description}</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button variant="outline" onClick={() => navigate(`/roles/${String(role.id)}/edit`)}>
                        <Settings2 className="h-4 w-4 mr-2" />
                        Edit Role
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Details */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Role Permissions</CardTitle>
                        <CardDescription>Actions allowed for users with this role.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {role.permissions.map((perm) => (
                                <Badge key={perm} variant="outline" className="px-3 py-1 flex items-center gap-1">
                                    <Lock className="h-3 w-3" />
                                    {perm}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Stats / Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    Active Users
                                </div>
                                <span className="font-bold text-lg">{role.userCount ?? 0}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <History className="h-4 w-4" />
                                    Created At
                                </div>
                                <span className="text-sm font-medium">{role.createdAt ?? "N/A"}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={`border-l-4 ${role.type === 'GLOBAL' ? 'border-l-purple-500' : 'border-l-blue-500'}`}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                {role.type === 'GLOBAL' ? <ShieldAlert className="h-4 w-4 text-purple-600" /> : <ShieldCheck className="h-4 w-4 text-blue-600" />}
                                Role Type
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{role.type}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {role.type === 'GLOBAL'
                                    ? "Applies to system-wide resources."
                                    : "Scoped to specific organizations."
                                }
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
            )}
        </div>
    );
}
