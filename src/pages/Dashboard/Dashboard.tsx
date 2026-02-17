import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Building2,
    ClipboardList,
    ArrowUpRight,
    TrendingUp,
    Activity,
    MapPin,
    AlertCircle,
    CheckCircle2,
    DollarSign,
    Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
    const stats = [
        {
            title: "Total Organizations",
            value: "2,482",
            change: "+12.5%",
            icon: Building2,
            color: "text-blue-600",
            bg: "bg-blue-50",
            trend: "up"
        },
        {
            title: "Active Users",
            value: "15,843",
            change: "+18.2%",
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50",
            trend: "up"
        },
        {
            title: "Open Requests",
            value: "142",
            change: "-4.5%",
            icon: ClipboardList,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            trend: "down"
        },
        {
            title: "Revenue (Mtd)",
            value: "$42.5k",
            change: "+8.1%",
            icon: DollarSign,
            color: "text-amber-600",
            bg: "bg-amber-50",
            trend: "up"
        },
    ];

    const recentActivities = [
        {
            id: 1,
            user: "Ahmed Mansour",
            action: "Updated branch details",
            target: "North Station",
            time: "2 minutes ago",
            icon: MapPin,
            iconColor: "text-blue-500",
        },
        {
            id: 2,
            user: "Sarah Al-Ghamdi",
            action: "Created new service request",
            target: "REQ-2024-081",
            time: "15 minutes ago",
            icon: AlertCircle,
            iconColor: "text-amber-500",
        },
        {
            id: 3,
            user: "System",
            action: "Auto-approved quotation",
            target: "QUO-9001",
            time: "1 hour ago",
            icon: CheckCircle2,
            iconColor: "text-emerald-500",
        },
        {
            id: 4,
            user: "Mohammed Khalid",
            action: "Logged inspection report",
            target: "INS-501",
            time: "3 hours ago",
            icon: ClipboardList,
            iconColor: "text-purple-500",
        },
    ];

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Operational <span className="text-primary italic">Insights</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-sm">
                        Real-time status of your energy network and service ecosystem.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                        <div className="h-8 w-8 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                            +12
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold">
                        Network Online
                    </Badge>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border-none shadow-sm hover:shadow-md transition-all cursor-default group overflow-hidden bg-white/50 backdrop-blur-sm border border-white/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} group-hover:rotate-12 transition-transform`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                            <div className="flex items-center mt-1">
                                <span className={`text-[10px] font-bold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'} flex items-center`}>
                                    {stat.change}
                                    <TrendingUp className={`h-2 w-2 ml-1 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium ml-2 italic">vs last month</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Performance Chart Section */}
                <Card className="lg:col-span-2 border-none shadow-xl bg-slate-950 text-white overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent pointer-events-none" />
                    <CardHeader className="pb-2 border-b border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    Energy Output Trend
                                </CardTitle>
                                <CardDescription className="text-slate-400 text-xs">
                                    Performance analytics across all active stations.
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Badge className="bg-white/10 text-white border-none text-[10px] font-bold">WEEKLY</Badge>
                                <Badge className="bg-primary text-white border-none text-[10px] font-bold">LIVE</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-8">
                        <div className="flex items-end gap-3 h-48 md:h-64">
                            {[45, 78, 52, 94, 68, 85, 62, 75, 58, 88, 72, 91].map((h, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-white/5 rounded-t-sm hover:bg-primary/80 transition-all cursor-pointer relative group/bar"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-2 py-1 rounded-md text-[10px] font-black shadow-xl opacity-0 group-hover/bar:opacity-100 transition-all transform group-hover/bar:-translate-y-1">
                                        {h}%
                                    </div>
                                    {h > 80 && (
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-1 bg-primary blur-sm" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Real-time Activity Section */}
                <Card className="border-none shadow-xl flex flex-col bg-white border border-slate-100 overflow-hidden">
                    <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                Live Feed
                            </CardTitle>
                            <div className="flex items-center gap-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Active</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto scrollbar-hide">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="p-5 hover:bg-slate-50/80 transition-all flex gap-4 items-start group relative">
                                    <div className={`p-2.5 rounded-xl bg-slate-100 ${activity.iconColor} group-hover:scale-110 group-hover:-rotate-6 transition-all shadow-sm`}>
                                        <activity.icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{activity.user}</p>
                                            <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded uppercase">{activity.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                            {activity.action} <span className="text-primary font-bold hover:underline cursor-pointer italic">#{activity.target}</span>
                                        </p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight className="h-3 w-3 text-slate-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="p-4 border-t bg-slate-50/30">
                        <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary hover:bg-transparent">
                            Load historical data
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
