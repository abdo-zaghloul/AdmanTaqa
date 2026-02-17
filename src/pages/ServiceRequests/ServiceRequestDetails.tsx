import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ChevronLeft,
    Building2,
    Calendar,
    CheckCircle2,
    PlayCircle,
    FileText,
    User,
    // MessageSquare,
    Wrench,
    History
    
} from "lucide-react";
import { toast } from "sonner";

// Mock Data
const MOCK_REQUESTS = [
    {
        id: "REQ-2024-001",
        subject: "Fuel Pump Maintenance",
        station: "Al-Amal Station",
        branch: "North Riyadh",
        status: "OPEN",
        priority: "HIGH",
        createdAt: "2024-02-08T09:00:00Z",
        description: "The main fuel pump in the north sector is showing inconsistent pressure readings. Requires urgent inspection and possible calibration.",
        requestedBy: "Ahmed Khalid (Station Manager)",
        category: "Maintenance"
    }
];

export default function ServiceRequestDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const req = MOCK_REQUESTS.find(r => r.id === id) || MOCK_REQUESTS[0];

    const handleUpdateStatus = (newStatus: string) => {
        toast.success(`Request status updated to ${newStatus.replace('_', ' ')}.`);
        navigate('/service-requests');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "OPEN":
                return <Badge className="bg-blue-50 text-blue-700 border-blue-200 shadow-none font-bold uppercase text-[10px]">OPEN</Badge>;
            case "IN_PROGRESS":
                return <Badge className="bg-amber-50 text-amber-700 border-amber-200 shadow-none font-bold uppercase text-[10px]">IN PROGRESS</Badge>;
            case "CLOSED":
                return <Badge className="bg-slate-50 text-slate-700 border-slate-200 shadow-none font-bold uppercase text-[10px]">CLOSED</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        const variants: any = {
            URGENT: "destructive",
            HIGH: "default",
            MEDIUM: "secondary",
            LOW: "outline",
        };
        return <Badge variant={variants[priority]} className="font-bold shadow-none uppercase text-[10px] tracking-widest">{priority}</Badge>;
    };

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-top duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/service-requests')} className="rounded-full shadow-sm border border-transparent hover:border-slate-200">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900">{req.subject}</h1>
                            {getPriorityBadge(req.priority)}
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">{req.id}</span>
                            <span className="text-slate-300">•</span>
                            {getStatusBadge(req.status)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => handleUpdateStatus('IN_PROGRESS')}>
                        <PlayCircle className="h-4 w-4" />
                        Assign & Start
                    </Button>
                    <Button className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus('CLOSED')}>
                        <CheckCircle2 className="h-4 w-4" />
                        Resolve
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm shadow-slate-200/50">
                        <CardHeader className="border-b bg-slate-50/50 py-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Request Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</p>
                                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{req.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                                                <Building2 className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Station / Branch</p>
                                                <p className="text-sm font-bold">{req.station} — {req.branch}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Requested By</p>
                                                <p className="text-sm font-bold">{req.requestedBy}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                                                <Calendar className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Created Date</p>
                                                <p className="text-sm font-bold">{new Date(req.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 flex-shrink-0">
                                                <Wrench className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Category</p>
                                                <p className="text-sm font-bold">{req.category}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm shadow-slate-200/50">
                        <CardHeader className="border-b bg-slate-50/50 py-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <History className="h-5 w-5 text-primary" />
                                Activity Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-0 before:h-full before:w-px before:bg-slate-100">
                                <div className="relative before:absolute before:-left-8 before:top-1.5 before:h-3 before:w-3 before:rounded-full before:bg-primary before:border-4 before:border-white shadow-none">
                                    <p className="text-xs font-bold text-slate-900 leading-none mb-1">Request Created</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{new Date(req.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="relative before:absolute before:-left-8 before:top-1.5 before:h-3 before:w-3 before:rounded-full before:bg-slate-200 before:border-4 before:border-white shadow-none">
                                    <p className="text-xs leading-none mb-1 text-slate-400 italic font-normal">Pending technician assignment...</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* <div className="space-y-6">
                    <Card className="border-none shadow-sm shadow-slate-200/50 bg-primary/5 border border-primary/10">
                        <CardHeader>
                            <CardTitle className="text-md flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start text-xs font-bold bg-white" size="sm">Add Internal Note</Button>
                            <Button variant="outline" className="w-full justify-start text-xs font-bold bg-white" size="sm">Contact Station Manager</Button>
                            <Button variant="outline" className="w-full justify-start text-xs font-bold bg-white text-destructive border-red-100 hover:bg-red-50" size="sm">Escalate Request</Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm shadow-slate-200/50">
                        <CardHeader className="border-b bg-slate-50/50 py-4">
                            <CardTitle className="text-md">Attachments</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-100 rounded-2xl opacity-50">
                                <FileText className="h-8 w-8 mb-2 text-slate-400" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Attachments</p>
                            </div>
                        </CardContent>
                    </Card>
                </div> */}
            </div>
        </div>
    );
}
