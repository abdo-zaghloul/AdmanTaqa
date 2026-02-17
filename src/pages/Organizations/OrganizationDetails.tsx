import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Building2,
    ChevronLeft,
    Mail,
    Phone,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    Shield,
    MapPin,
    FileText,
    Activity
} from "lucide-react";
import { toast } from "sonner";

// Mock Data (In a real app, this would come from an API)
const MOCK_ORGANIZATIONS = [
    {
        id: "ORG-001",
        name: "Al-Amal Fuel Station",
        type: "FUEL_STATION",
        status: "APPROVED",
        email: "contact@alamal.com",
        phone: "+966 50 123 4567",
        address: "King Fahd Road, Riyadh, KSA",
        createdAt: "2024-01-15T10:00:00Z",
        branches: 8,
        lastInspection: "2024-02-01",
        description: "One of the leading fuel stations in the central region, committed to high quality standards."
    },
    {
        id: "ORG-002",
        name: "EcoEnergy Services",
        type: "SERVICE_PROVIDER",
        status: "PENDING",
        email: "info@ecoenergy.sa",
        phone: "+966 55 987 6543",
        address: "Tahlia Street, Jeddah, KSA",
        createdAt: "2024-02-01T14:30:00Z",
        branches: 3,
        lastInspection: "N/A",
        description: "Specialized in eco-friendly maintenance solutions for petroleum facilities."
    }
];

export default function OrganizationDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Find organization by ID or use ORG-001 by default for demo
    const org = MOCK_ORGANIZATIONS.find(o => o.id === id) || MOCK_ORGANIZATIONS[0];

    const handleApprove = () => {
        toast.success(`Organization ${org.name} has been approved.`);
        navigate('/organizations');
    };

    const handleReject = () => {
        toast.error(`Organization ${org.name} has been rejected.`);
        navigate('/organizations');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return (
                    <Badge className="bg-green-50 text-green-700 border-green-200 gap-1.5 px-3 py-1 shadow-none font-bold uppercase text-[10px]">
                        <CheckCircle2 className="h-3 w-3" />
                        Approved
                    </Badge>
                );
            case "PENDING":
                return (
                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 gap-1.5 px-3 py-1 shadow-none font-bold uppercase text-[10px]">
                        <Clock className="h-3 w-3" />
                        Pending Review
                    </Badge>
                );
            case "REJECTED":
                return (
                    <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 gap-1.5 px-3 py-1 shadow-none font-bold uppercase text-[10px]">
                        <XCircle className="h-3 w-3" />
                        Rejected
                    </Badge>
                );
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/organizations')} className="rounded-full hover:bg-white shadow-sm border border-transparent hover:border-slate-200">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold tracking-tight">{org.name}</h1>
                            {getStatusBadge(org.status)}
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">ID: {org.id}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-medium uppercase tracking-wider">{org.type.replace('_', ' ')}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {org.status === 'PENDING' ? (
                        <>
                            <Button variant="destructive" className="gap-2 shadow-lg" onClick={handleReject}>
                                <XCircle className="h-4 w-4" />
                                Reject
                            </Button>
                            <Button className="gap-2 shadow-lg bg-green-600 hover:bg-green-700" onClick={handleApprove}>
                                <CheckCircle2 className="h-4 w-4" />
                                Approve
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" className="gap-2 shadow-sm">
                            <Shield className="h-4 w-4" />
                            Manage Permissions
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm shadow-slate-200/50">
                        <CardHeader className="border-b bg-slate-50/50 py-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                Profile Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="group">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                            <Mail className="h-3 w-3" />
                                            Email Address
                                        </p>
                                        <p className="text-sm font-semibold">{org.email}</p>
                                    </div>
                                    <div className="group">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                            <Phone className="h-3 w-3" />
                                            Phone Number
                                        </p>
                                        <p className="text-sm font-semibold">{org.phone}</p>
                                    </div>
                                    <div className="group">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                            <MapPin className="h-3 w-3" />
                                            Office Address
                                        </p>
                                        <p className="text-sm font-semibold">{org.address}</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="group">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            Registration Date
                                        </p>
                                        <p className="text-sm font-semibold">{new Date(org.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="group">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                            <FileText className="h-3 w-3" />
                                            Description
                                        </p>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                            {org.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm shadow-slate-200/50 overflow-hidden">
                        <CardHeader className="border-b bg-slate-50/50 py-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Operational Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 pb-0 px-0">
                            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
                                <div className="p-6 text-center hover:bg-slate-50 transition-colors">
                                    <p className="text-3xl font-black text-slate-900 mb-1">{org.branches}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Branches</p>
                                </div>
                                <div className="p-6 text-center hover:bg-slate-50 transition-colors">
                                    <p className="text-3xl font-black text-green-600 mb-1">100%</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Compliance</p>
                                </div>
                                <div className="p-6 text-center hover:bg-slate-50 transition-colors">
                                    <p className="text-3xl font-black text-blue-600 mb-1">24</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Users</p>
                                </div>
                                <div className="p-6 text-center hover:bg-slate-50 transition-colors">
                                    <p className="text-3xl font-black text-amber-600 mb-1">3</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Open Requests</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm shadow-slate-200/50">
                        <CardHeader className="border-b bg-slate-50/50 py-4">
                            <CardTitle className="text-lg">Recent Compliance</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="p-4 rounded-xl border bg-slate-50/50 border-slate-100 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Audit</span>
                                    <Badge variant="outline" className="text-[10px] font-bold text-green-600 border-green-200 bg-green-50 shadow-none">PASSED</Badge>
                                </div>
                                <p className="text-sm font-semibold">{org.lastInspection}</p>
                            </div>
                            <div className="p-4 rounded-xl border bg-slate-50/50 border-slate-100 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Next Audit</span>
                                    <Badge variant="outline" className="text-[10px] font-bold text-blue-600 border-blue-200 bg-blue-50 shadow-none">SCHEDULED</Badge>
                                </div>
                                <p className="text-sm font-semibold">2024-03-15</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
