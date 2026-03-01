import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    ChevronLeft,
    Building2,
    Calendar,
    CheckCircle2,
    PlayCircle,
    PauseCircle,
    XCircle,
    FileText,
    User,
    Hammer,
    Clock,
    History,
    MapPin
} from "lucide-react";
import useGetJobOrderById from "@/hooks/JobOrders/useGetJobOrderById";

export default function JobOrderDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: job, isLoading, isError, error } = useGetJobOrderById(id);

    const handleUpdateStatus = (newStatus: string) => {
        toast.success(`Job order status updated to ${newStatus.replace('_', ' ')}.`);
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            COMPLETED: "bg-green-50 text-green-700 border-green-200",
            IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
            PLANNED: "bg-amber-50 text-amber-700 border-amber-200",
            PENDING: "bg-slate-50 text-slate-700 border-slate-200",
            CANCELLED: "bg-red-50 text-red-700 border-red-200",
        };
        const icons: Record<string, any> = {
            COMPLETED: <CheckCircle2 className="h-3 w-3" />,
            IN_PROGRESS: <PlayCircle className="h-3 w-3" />,
            PLANNED: <Calendar className="h-3 w-3" />,
            PENDING: <Clock className="h-3 w-3" />,
            CANCELLED: <XCircle className="h-3 w-3" />,
        };
        return (
            <Badge className={`${styles[status]} border shadow-none font-bold uppercase text-[10px] gap-1.5`}>
                {icons[status]}
                {status.replace('_', ' ')}
            </Badge>
        );
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
        <div className="p-4 md:p-8">
            {isLoading || !id ? (
                <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">Loading...</div>
            ) : isError ? (
                <div className="space-y-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/job-orders")} className="gap-2">
                        <ChevronLeft className="h-4 w-4" /> Back to Job Orders
                    </Button>
                    <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-destructive">
                        {(error as Error)?.message ?? "Failed to load job order."}
                    </div>
                </div>
            ) : !job ? (
                <div className="space-y-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/job-orders")} className="gap-2">
                        <ChevronLeft className="h-4 w-4" /> Back to Job Orders
                    </Button>
                    <div className="rounded-lg border border-muted bg-muted/30 p-6 text-center text-muted-foreground">
                        <p className="font-medium">Job order not found.</p>
                        <p className="text-sm mt-1">The job order may have been removed or you may not have permission to view it.</p>
                        <Link to="/job-orders" className="inline-block mt-4 text-primary hover:underline">Return to Job Orders</Link>
                    </div>
                </div>
            ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-top duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/job-orders')} className="rounded-full shadow-sm border border-transparent hover:border-slate-200">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900">{job.title}</h1>
                            {getPriorityBadge(job.priority)}
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">{job.id}</span>
                            <span className="text-slate-300">•</span>
                            {getStatusBadge(job.status)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {job.status === 'PLANNED' && (
                        <Button variant="outline" className="gap-2" onClick={() => handleUpdateStatus('IN_PROGRESS')}>
                            <PlayCircle className="h-4 w-4" />
                            Start Work
                        </Button>
                    )}
                    {job.status === 'IN_PROGRESS' && (
                        <>
                            <Button variant="outline" className="gap-2" onClick={() => handleUpdateStatus('PENDING')}>
                                <PauseCircle className="h-4 w-4" />
                                Pause
                            </Button>
                            <Button className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus('COMPLETED')}>
                                <CheckCircle2 className="h-4 w-4" />
                                Mark Complete
                            </Button>
                        </>
                    )}
                    {job.status === 'PENDING' && (
                        <Button variant="outline" className="gap-2" onClick={() => handleUpdateStatus('IN_PROGRESS')}>
                            <PlayCircle className="h-4 w-4" />
                            Resume
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm shadow-slate-200/50">
                        <CardHeader className="border-b bg-slate-50/50 py-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Job Order Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</p>
                                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{job.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                                                <Building2 className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Service Provider</p>
                                                <p className="text-sm font-bold">{job.provider}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                                                <MapPin className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Branch Location</p>
                                                <p className="text-sm font-bold">{job.branch}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Assigned Team</p>
                                                <p className="text-sm font-bold">{job.assignedTeam}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                                                <Calendar className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Start Date</p>
                                                <p className="text-sm font-bold">{job.startDate ? new Date(job.startDate).toLocaleDateString() : "—"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
                                                <Calendar className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Expected End Date</p>
                                                <p className="text-sm font-bold">{job.endDate ? new Date(job.endDate).toLocaleDateString() : "—"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 flex-shrink-0">
                                                <Hammer className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Job Type</p>
                                                <p className="text-sm font-bold">{job.jobType}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {job.estimatedCost != null && (
                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Cost Estimate</p>
                                        <p className="text-2xl font-black text-primary">{job.estimatedCost.toLocaleString()} SAR</p>
                                    </div>
                                )}
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
                                    <p className="text-xs font-bold text-slate-900 leading-none mb-1">Job Order Created</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{job.createdAt ? new Date(job.createdAt).toLocaleString() : "—"}</p>
                                    <p className="text-[10px] text-slate-500 mt-1">Requested by: {job.requestedBy}</p>
                                </div>
                                {job.status === 'PLANNED' && (
                                    <div className="relative before:absolute before:-left-8 before:top-1.5 before:h-3 before:w-3 before:rounded-full before:bg-amber-400 before:border-4 before:border-white shadow-none">
                                        <p className="text-xs font-bold text-amber-700 leading-none mb-1">Scheduled for {job.startDate ? new Date(job.startDate).toLocaleDateString() : "—"}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Assigned to {job.assignedTeam}</p>
                                    </div>
                                )}
                                {job.status === 'IN_PROGRESS' && (
                                    <div className="relative before:absolute before:-left-8 before:top-1.5 before:h-3 before:w-3 before:rounded-full before:bg-blue-500 before:border-4 before:border-white shadow-none">
                                        <p className="text-xs font-bold text-blue-700 leading-none mb-1">Work in Progress</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Team is actively working on this job</p>
                                    </div>
                                )}
                                {job.status === 'COMPLETED' && (
                                    <div className="relative before:absolute before:-left-8 before:top-1.5 before:h-3 before:w-3 before:rounded-full before:bg-green-500 before:border-4 before:border-white shadow-none">
                                        <p className="text-xs font-bold text-green-700 leading-none mb-1">Job Completed</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Successfully finished on {job.endDate ? new Date(job.endDate).toLocaleDateString() : "—"}</p>
                                    </div>
                                )}
                                {(job.status === 'PLANNED' || job.status === 'PENDING') && (
                                    <div className="relative before:absolute before:-left-8 before:top-1.5 before:h-3 before:w-3 before:rounded-full before:bg-slate-200 before:border-4 before:border-white shadow-none">
                                        <p className="text-xs leading-none mb-1 text-slate-400 italic font-normal">Awaiting commencement...</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm shadow-slate-200/50 bg-primary/5 border border-primary/10">
                        <CardHeader>
                            <CardTitle className="text-md flex items-center gap-2">
                                <Hammer className="h-4 w-4 text-primary" />
                                Quick Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Status</span>
                                <span className="text-xs font-bold">{getStatusBadge(job.status)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Priority</span>
                                <span className="text-xs font-bold">{getPriorityBadge(job.priority)}</span>
                            </div>
                            {job.startDate && job.endDate && (
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">Duration</span>
                                    <span className="text-xs font-bold">
                                        {Math.ceil((new Date(job.endDate).getTime() - new Date(job.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            </div>
            )}
        </div>
    );
}
