import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Mail,
  Phone,
  User,
  Shield,
  Building2,
  Pencil,
  Trash2,
} from "lucide-react";
import useGetUserById from "@/hooks/Users/useGetUserById";
import { getRoleDisplayLabel } from "@/types/user";
import EditUserDialog from "./component/EditUserDialog";
import DeleteUserDialog from "./component/DeleteUserDialog";

function getRoleBadge(role?: string) {
  if (!role) return <Badge variant="secondary">—</Badge>;
  const variants: Record<string, string> = {
    ADMIN: "bg-blue-50 text-blue-700 border-blue-200",
    AUTHORITY: "bg-purple-50 text-purple-700 border-purple-200",
    SERVICE_PROVIDER: "bg-emerald-50 text-emerald-700 border-emerald-200",
    BRANCH_MANAGER: "bg-amber-50 text-amber-700 border-amber-200",
    TECHNICIAN: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <Badge className={`${variants[role] || "bg-gray-50"} border font-bold shadow-none uppercase text-[10px] tracking-widest`}>
      {role.replace(/_/g, " ")}
    </Badge>
  );
}

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useGetUserById(id);
  const status = user?.isActive === false ? "INACTIVE" : "ACTIVE";
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading || !id) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[200px] text-muted-foreground">
        Loading...
      </div>
    );
  }
  if (isError || !user) {
    return (
      <div className="p-4 md:p-8">
        <Button variant="ghost" onClick={() => navigate("/users")} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-destructive">
          User not found.
        </div>
      </div>
    );
  }

  return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/users')} className="rounded-full shadow-sm border border-transparent hover:border-slate-200">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl shadow-inner">
                            {user.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-black tracking-tight text-slate-900">{user.fullName}</h1>
                                <Badge variant={status === "ACTIVE" ? "default" : "secondary"} className={`shadow-none font-bold text-[10px] ${status === "ACTIVE" ? "bg-green-600 hover:bg-green-600" : ""}`}>
                                    {status}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-slate-500">{user.id}</span>
                                <span className="text-slate-300">•</span>
                                {getRoleBadge(getRoleDisplayLabel(user))}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 shadow-sm" onClick={() => setEditOpen(true)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Button>
                    <Button variant="destructive" className="gap-2 shadow-lg" onClick={() => setDeleteOpen(true)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm shadow-slate-200/50">
                        <CardHeader className="border-b bg-slate-50/50 py-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="group p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                            <Mail className="h-3 w-3" />
                                            Email Address
                                        </p>
                                        <p className="text-sm font-bold text-slate-800">{user.email}</p>
                                    </div>
                                    <div className="group p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                            <Phone className="h-3 w-3" />
                                            Contact Number
                                        </p>
                                        <p className="text-sm font-bold text-slate-800">{user.phone ?? "—"}</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="group p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                            <Building2 className="h-3 w-3" />
                                            Organization
                                        </p>
                                        <p className="text-sm font-bold text-slate-800">{user.organization?.name ?? "—"}</p>
                                    </div>
                                    <div className="group p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                            <Shield className="h-3 w-3" />
                                            Access Level
                                        </p>
                                        <div>{getRoleBadge(getRoleDisplayLabel(user))}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
 
                </div>
 
            </div>

            <EditUserDialog
              open={editOpen}
              onOpenChange={setEditOpen}
              user={{
                id: user.id,
                fullName: user.fullName,
                phone: user.phone,
                isActive: user.isActive,
              }}
            />

            <DeleteUserDialog
              open={deleteOpen}
              onOpenChange={(open) => {
                setDeleteOpen(open);
                if (!open) navigate("/users");
              }}
              user={{ id: user.id, fullName: user.fullName }}
            />
        </div>
    );
}
