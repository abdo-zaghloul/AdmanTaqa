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
    Clock,
    Activity,
    Calendar,
    Lock
} from "lucide-react";


// Mock Data
const MOCK_USERS = [
    {
        id: "USR-001",
        fullName: "Ahmed Mansour",
        email: "ahmed.m@alamal.com",
        phone: "+966 50 123 4567",
        role: "ADMIN",
        orgName: "Al-Amal Fuel Station",
        status: "ACTIVE",
        createdAt: "2024-01-15T10:00:00Z",
        lastLogin: "2024-02-09T18:30:00Z",
        description: "System Administrator with full access to all modules and configurations."
    },
    {
        id: "USR-002",
        fullName: "Sarah Al-Ghamdi",
        email: "sarah.g@ecoenergy.sa",
        phone: "+966 55 987 6543",
        role: "SERVICE_PROVIDER",
        orgName: "EcoEnergy Services",
        status: "ACTIVE",
        createdAt: "2024-02-01T14:30:00Z",
        lastLogin: "2024-02-08T11:20:00Z",
        description: "Service Provider representative managing technical requests and site visits."
    }
];

export default function UserDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const user = MOCK_USERS.find(u => u.id === id) || MOCK_USERS[0];

    const getRoleBadge = (role: string) => {
        const variants: Record<string, string> = {
            ADMIN: "bg-blue-50 text-blue-700 border-blue-200",
            AUTHORITY: "bg-purple-50 text-purple-700 border-purple-200",
            SERVICE_PROVIDER: "bg-emerald-50 text-emerald-700 border-emerald-200",
            BRANCH_MANAGER: "bg-amber-50 text-amber-700 border-amber-200",
            TECHNICIAN: "bg-slate-50 text-slate-700 border-slate-200",
        };

        return (
            <Badge className={`${variants[role] || "bg-gray-50"} border font-bold shadow-none uppercase text-[10px] tracking-widest`}>
                {role.replace('_', ' ')}
            </Badge>
        );
    };

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
                                <Badge variant={user.status === 'ACTIVE' ? "default" : "secondary"} className={`shadow-none font-bold text-[10px] ${user.status === 'ACTIVE' ? "bg-green-600 hover:bg-green-600" : ""}`}>
                                    {user.status}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-slate-500">{user.id}</span>
                                <span className="text-slate-300">•</span>
                                {getRoleBadge(user.role)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 shadow-sm" onClick={handleResetPassword}>
                        <Key className="h-4 w-4" />
                        Reset Password
                    </Button>
                    <Button
                        variant={user.status === 'ACTIVE' ? "destructive" : "default"}
                        className="gap-2 shadow-lg"
                        onClick={handleToggleStatus}
                    >
                        {user.status === 'ACTIVE' ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                        {user.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
                    </Button>
                </div> */}
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
                                        <p className="text-sm font-bold text-slate-800">{user.phone}</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="group p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                            <Building2 className="h-3 w-3" />
                                            Organization
                                        </p>
                                        <p className="text-sm font-bold text-slate-800">{user.orgName}</p>
                                    </div>
                                    <div className="group p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                            <Shield className="h-3 w-3" />
                                            Access Level
                                        </p>
                                        <p className="text-sm font-bold text-slate-800">{user.role}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm shadow-slate-200/50">
                        <CardHeader className="border-b bg-slate-50/50 py-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Security & Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 pb-0 px-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                <div className="p-6">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Calendar className="h-3 w-3" />
                                        Joined Date
                                    </p>
                                    <p className="text-sm font-black text-slate-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="p-6">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Clock className="h-3 w-3" />
                                        Last Active
                                    </p>
                                    <p className="text-sm font-black text-slate-900">{new Date(user.lastLogin).toLocaleString()}</p>
                                </div>
                                <div className="p-6">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Lock className="h-3 w-3" />
                                        MFA Status
                                    </p>
                                    <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 shadow-none font-bold text-[10px]">ENABLED</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm shadow-slate-200/50">
                        <CardHeader className="border-b bg-slate-50/50 py-4">
                            <CardTitle className="text-md">Profile Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                {user.description}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm shadow-slate-200/50">
                        <CardHeader className="border-b bg-slate-50/50 py-4 px-6 flex flex-row items-center justify-between">
                            <CardTitle className="text-md">Permissions</CardTitle>
                            <Button variant="link" className="h-auto p-0 text-xs font-bold text-primary">Manage</Button>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-3">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100/50">
                                <span className="text-xs font-bold text-slate-700">User Management</span>
                                <Badge className="bg-green-500 scale-75 shadow-none">ON</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100/50">
                                <span className="text-xs font-bold text-slate-700">Settings Access</span>
                                <Badge className="bg-green-500 scale-75 shadow-none">ON</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100/50">
                                <span className="text-xs font-bold text-slate-700">Audit Logs View</span>
                                <Badge className="bg-green-500 scale-75 shadow-none">ON</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
