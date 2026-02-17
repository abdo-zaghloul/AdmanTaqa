import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Ghost, Search, Map as MapIcon } from "lucide-react";

export default function NotFound() {
    return (
        <div className="m-16 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center animate-in fade-in zoom-in duration-700">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 flex items-center justify-center">
                    <Ghost className="h-24 w-24 text-primary animate-bounce decoration-slate-500" />
                </div>
                <div className="absolute -top-4 -right-4 h-12 w-12 bg-amber-100 rounded-2xl flex items-center justify-center shadow-lg animate-bounce delay-100">
                    <Search className="h-6 w-6 text-amber-600" />
                </div>
                <div className="absolute -bottom-2 -left-6 h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center shadow-lg animate-bounce delay-300">
                    <MapIcon className="h-5 w-5 text-blue-600" />
                </div>
            </div>

            <h1 className="text-8xl font-black tracking-tighter text-slate-900 mb-2">404</h1>
            <h2 className="text-2xl font-bold text-slate-700 mb-4 uppercase tracking-wider">Page Not Found</h2>

            <p className="max-w-md text-slate-500 mb-10 text-lg leading-relaxed">
                Oops! The page you're looking for seems to have vanished into thin air.
                It might have moved or perhaps it never existed in the first place.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button asChild size="lg" className="h-12 px-8 gap-2 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    <Link to="/">
                        <Home className="h-4 w-4" />
                        Return Home
                    </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 gap-2 border-slate-200 hover:bg-slate-50 transition-all" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                </Button>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-100 w-full max-w-xs">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">Error Code</p>
                <p className="text-sm font-mono text-slate-500 bg-slate-50 py-1 rounded">ERR_ROUTE_NOT_DEFINED</p>
            </div>
        </div>
    );
}
