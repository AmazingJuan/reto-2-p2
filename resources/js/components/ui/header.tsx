import { Shield } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Breadcrumbs from './breadcrumbs';

export default function Header() {
  return (
    <header className="animate-slide-up fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-[#1a1e2b] backdrop-blur-xl">
      {/* Línea decorativa gradiente inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0693e3]/50 to-transparent opacity-50" />

      {/* Vista Mobile */}
      <div className="flex flex-col items-center gap-2 px-4 py-2 md:hidden">
          <Link
              href={route('dashboard')}
              className="group inline-flex items-center gap-2 rounded-xl border-2 border-slate-500/80 bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-300 hover:border-[#0693e3] hover:bg-[#0693e3] hover:text-white hover:shadow-lg hover:shadow-[#0693e3]/25"
          >
              Admin
              <Shield className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110" aria-hidden />
          </Link>
          <Breadcrumbs />
      </div>

      {/* Vista PC */}
      <div className="relative hidden md:flex items-center justify-between px-6 py-4 container mx-auto min-h-[60px]">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <Breadcrumbs />
          </div>
          <div className="ml-auto">
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