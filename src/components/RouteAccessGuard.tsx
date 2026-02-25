import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, ShieldAlert, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ROUTE_ACCESS_RULES, canAccessByRule } from "@/lib/accessControl";

type Props = {
  pathKey: string;
  children: ReactNode;
};

export default function RouteAccessGuard({ pathKey, children }: Props) {
  const { organization, permissions } = useAuth();
  const rule = ROUTE_ACCESS_RULES[pathKey];
  const allowed = canAccessByRule(rule, organization?.type, permissions);

  if (!allowed) {
    return (
      <div className="m-16 flex min-h-[80vh] flex-col items-center justify-center px-4 text-center animate-in fade-in zoom-in duration-700">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-destructive/20 blur-3xl scale-150 animate-pulse" />
          <div className="relative flex items-center justify-center rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl">
            <ShieldAlert className="h-24 w-24 text-destructive animate-bounce" />
          </div>
          <div className="absolute -top-4 -right-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 shadow-lg animate-bounce delay-100">
            <LockKeyhole className="h-6 w-6 text-amber-600" />
          </div>
        </div>

        <h1 className="mb-2 text-5xl font-black tracking-tight text-slate-900">Access Denied</h1>
        <h2 className="mb-4 text-xl font-bold tracking-wide text-slate-700">You are not authorized</h2>

        <p className="mb-10 max-w-md text-lg leading-relaxed text-slate-500">
          You do not have the required permissions to access this page. You can go back or return to the home page.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="h-12 gap-2 px-8 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Link to="/">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 gap-2 border-slate-200 px-8 transition-all hover:bg-slate-50"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        <div className="mt-16 w-full max-w-xs border-t border-slate-100 pt-8">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-400">Error Code</p>
          <p className="rounded bg-slate-50 py-1 font-mono text-sm text-slate-500">ERR_FORBIDDEN_403</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
