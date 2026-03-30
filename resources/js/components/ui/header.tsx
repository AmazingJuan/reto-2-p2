import { Shield } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Breadcrumbs from './breadcrumbs';

export default function Header() {
    return (
        <header className="animate-slide-up fixed left-0 right-0 top-0 z-50 min-h-[88px] border-b border-slate-700/50 bg-[#1a1e2b] shadow-md backdrop-blur-xl">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0693e3]/60 to-transparent" aria-hidden />
            <div className="relative mx-auto flex min-h-[88px] max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-14 sm:px-28">
                    <div className="pointer-events-auto max-w-[min(100%,30rem)] sm:max-w-none">
                        <Breadcrumbs />
                    </div>
                </div>
                <div className="relative z-10 ml-auto shrink-0">
                    <Link
                        href={route('dashboard')}
                        className="group inline-flex items-center gap-2 rounded-xl border-2 border-slate-500/80 bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-300 hover:border-[#0693e3] hover:bg-[#0693e3] hover:text-white hover:shadow-lg hover:shadow-[#0693e3]/25"
                    >
                        <span className="hidden sm:inline">Admin</span>
                        <span className="sm:hidden">Panel</span>
                        <Shield className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110" aria-hidden />
                    </Link>
                </div>
            </div>
        </header>
    );
}
