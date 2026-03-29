import { Shield } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Breadcrumbs from './breadcrumbs';

export default function Header() {
  return (
    <header className="animate-slide-up fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-[#1a1e2b] backdrop-blur-xl">
      {/* Línea decorativa gradiente inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0693e3]/50 to-transparent opacity-50" />

      {/* Mobile layout */}
    <div className="flex flex-col items-center gap-2 px-4 py-3 md:hidden">
      <Link href={route('dashboard')}>
        <button className="group flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-700 transition-all duration-300 hover:border-[#0693e3] hover:bg-[#0693e3] hover:text-white">
          Admin
          <Shield size={16} className="transition-transform duration-300 group-hover:scale-110" />
        </button>
      </Link>
      <Breadcrumbs />
    </div>

      {/* Desktop layout */}
      <div className="relative hidden md:flex items-center justify-between px-6 py-8 container mx-auto min-h-[96px]">
        {/* Breadcrumbs absolutamente centrados */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Breadcrumbs />
        </div>
        {/* Botón derecha */}
        <div className="ml-auto">
          <Link href={route('dashboard')}>
            <button className="group flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-2 text-slate-700 transition-all duration-300 hover:border-[#0693e3] hover:bg-[#0693e3] hover:text-white hover:shadow-lg hover:shadow-[#0693e3]/20">
              Admin
              <Shield size={18} className="transition-transform duration-300 group-hover:scale-110" />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}