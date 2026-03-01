import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import ErrorBoundary from './ErrorBoundary';

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-[1px] bg-slate-200 mx-2 hidden md:block" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-black text-xl italic">T</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-none tracking-tight text-slate-900">TAQA Admin</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Control Center</span>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto w-full max-w-[1600px] mx-auto">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </SidebarInset>
      </div>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}
