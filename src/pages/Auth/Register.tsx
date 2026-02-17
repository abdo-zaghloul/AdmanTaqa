import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { useRegisterForm } from "@/hooks/Auth/useRegisterForm"
import {
    User,
    Mail,
    Lock,
    Building2,
    Phone,
    ChevronLeft,
    Loader2,
    ShieldCheck,
    Briefcase,
    BadgeCheck
} from "lucide-react"

export default function Register() {
    const { register, handleSubmit, formState: { errors }, isLoading } = useRegisterForm()

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Info & Branding */}
            <div className="hidden lg:flex lg:w-[40%] relative bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-slate-900 to-slate-950 z-10" />

                <div className="relative z-20 flex flex-col justify-between p-12 w-full">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-white font-black text-2xl italic">T</span>
                        </div>
                        <span className="text-xl font-black tracking-tight text-white uppercase italic">TAQA</span>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-white leading-tight">
                                Join the network of <span className="text-primary underline decoration-primary/30 underline-offset-8">Excellence</span>.
                            </h2>
                            <p className="text-slate-400 font-medium">
                                Start your journey as a certified partner in our energy ecosystem.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: ShieldCheck, title: "Industry Compliance", desc: "Adhere to state-of-the-art safety and regulatory standards." },
                                { icon: Briefcase, title: "Business Growth", desc: "Access high-value service requests and expand your reach." },
                                { icon: BadgeCheck, title: "Verified Identity", desc: "Gain trust with our multi-level verification system." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-primary">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                                        <p className="text-xs text-slate-500 font-medium mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Notice</div>
                        <p className="text-[11px] leading-relaxed text-slate-400 font-medium italic">
                            All registration requests undergo a formal manual verification process by our authority team within 24-48 business hours.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-[60%] flex flex-col bg-slate-50/20 overflow-y-auto max-h-screen custom-scrollbar">
                <div className="max-w-2xl w-full mx-auto p-8 md:p-16 lg:p-20 space-y-10">
                    <div className="flex items-center justify-between">
                        <Link to="/login" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors group">
                            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to login
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900">Partner Enrollment</h1>
                        <p className="text-slate-500 font-medium">Create your organization account and join the platform.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Organization */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                <Building2 className="h-3 w-3" />
                                Organization Profile
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="organizationName" className="text-xs font-bold text-slate-600">Company Name</Label>
                                    <Input
                                        id="organizationName"
                                        placeholder="Energy Corp Inc."
                                        className="h-11 bg-white"
                                        {...register("organizationName")}
                                    />
                                    {errors.organizationName?.message && (
                                        <p className="text-xs text-red-600 font-medium">{errors.organizationName.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="organizationType" className="text-xs font-bold text-slate-600">Primary Industry</Label>
                                    <select
                                        id="organizationType"
                                        className="flex h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none font-medium text-slate-900"
                                        {...register("organizationType")}
                                    >
                                        <option value="SERVICE_PROVIDER">Service Provider</option>
                                        <option value="FUEL_STATION">Fuel Station</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Personal */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                <User className="h-3 w-3" />
                                Authorized Representative
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-xs font-bold text-slate-600">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="fullName"
                                            placeholder="Alexander Smith"
                                            className="pl-10 h-11 bg-white"
                                            {...register("fullName")}
                                        />
                                    </div>
                                    {errors.fullName?.message && (
                                        <p className="text-xs text-red-600 font-medium">{errors.fullName.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-xs font-bold text-slate-600">Direct Phone</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="phone"
                                            placeholder="+966 5X XXX XXXX"
                                            className="pl-10 h-11 bg-white"
                                            {...register("phone")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Credentials */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                <Lock className="h-3 w-3" />
                                Account Security
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold text-slate-600">Business Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@company.com"
                                            className="pl-10 h-11 bg-white"
                                            {...register("email")}
                                        />
                                    </div>
                                    {errors.email?.message && (
                                        <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-xs font-bold text-slate-600">Secure Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 h-11 bg-white"
                                            {...register("password")}
                                        />
                                    </div>
                                    {errors.password?.message && (
                                        <p className="text-xs text-red-600 font-medium">{errors.password.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 space-y-4">
                            <Button
                                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xl shadow-slate-200 active:scale-[0.98] transition-all"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Processing Enrollment...
                                    </>
                                ) : (
                                    "Initialize Partner Account"
                                )}
                            </Button>

                            <p className="text-center text-[11px] text-slate-400 font-medium px-8">
                                By clicking the button above, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
