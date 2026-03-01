import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { useLoginForm } from "@/hooks/Auth/useLoginForm"
import {
    Mail,
    Lock,
    ArrowRight,
    ShieldCheck,
    Zap,
    ChevronRight,
    Loader2,
    Activity
} from "lucide-react"

export default function Login() {
    const { register, handleSubmit, formState: { errors }, isLoading, apiError } = useLoginForm();

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Branding & Visuals */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent z-10" />

                {/* Decorative background elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[150px]" />

                <div className="relative z-20 flex flex-col justify-between p-16 w-full">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
                            <span className="text-white font-black text-3xl italic">T</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">TAQA <span className="text-primary">ADMIN</span></span>
                    </div>

                    <div className="max-w-md">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                            <Zap className="h-3 w-3 fill-primary" />
                            Next-Gen Energy Management
                        </div>
                        <h1 className="text-5xl font-black text-white leading-[1.1] mb-6">
                            Control the future of <span className="text-primary italic">Power</span>.
                        </h1>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed">
                            Monitor, manage, and optimize your entire energy infrastructure from a single, high-performance interface.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-12">
                        <div className="space-y-1">
                            <p className="text-white text-2xl font-black tracking-tight">99.9%</p>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">System Uptime</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-white text-2xl font-black tracking-tight">256-bit</p>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">AES Encryption</p>
                        </div>
                    </div>
                </div>

                {/* Floating UI Mockup element */}
                <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-80 h-96 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-2xl transform rotate-6 hidden xl:block">
                    <div className="space-y-4">
                        <div className="h-8 w-24 bg-white/10 rounded-lg" />
                        <div className="space-y-2">
                            <div className="h-2 w-full bg-white/10 rounded-full" />
                            <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-4">
                            <div className="h-20 bg-primary/20 rounded-xl" />
                            <div className="h-20 bg-white/5 rounded-xl" />
                        </div>
                        <div className="h-32 w-full border border-white/5 rounded-2xl flex items-center justify-center">
                            <Activity className="h-8 w-8 text-primary/40 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-slate-50/30">
                <div className="max-w-md w-full mx-auto space-y-8">
                    <div className="space-y-2">
                        <div className="lg:hidden flex items-center gap-2 mb-8">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-white font-black text-xl italic">T</span>
                            </div>
                            <span className="text-xl font-black tracking-tighter">TAQA</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">Welcome back</h2>
                        <p className="text-slate-500 font-medium">Enter your credentials to access the control panel.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2 group">
                                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400 group-focus-within:text-primary transition-colors">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        className="pl-10 h-12 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 transition-all font-medium"
                                        {...register("email")}
                                    />
                                </div>
                                {errors.email?.message && (
                                    <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="space-y-2 group">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400 group-focus-within:text-primary transition-colors">Password</Label>
                                    <Link to="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-12 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 transition-all font-medium"
                                        {...register("password")}
                                    />
                                </div>
                                {errors.password?.message && (
                                    <p className="text-xs text-red-600 font-medium">{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        {apiError && (
                            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700">
                                {apiError}
                            </div>
                        )}
                        <Button
                            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xl shadow-slate-200 group relative overflow-hidden active:scale-[0.98] transition-all"
                            type="submit"
                            disabled={isLoading}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Sign In to Dashboard
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </Button>
                    </form>

                    <div className="pt-8 flex flex-col items-center gap-6">
                        <div className="w-full flex items-center gap-4">
                            <div className="h-[1px] flex-1 bg-slate-200" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Clearance</span>
                            <div className="h-[1px] flex-1 bg-slate-200" />
                        </div>

                        <div className="flex items-center gap-2 bg-slate-100/50 px-4 py-2 rounded-full border border-slate-200/50">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Enterprise Grade Security Enabled</span>
                        </div>

                        <p className="text-sm text-center text-slate-500 font-medium">
                            New user?{" "}
                            <Link to="/register" className="text-primary font-black hover:underline inline-flex items-center gap-1 group">
                                Create organization account
                                <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
