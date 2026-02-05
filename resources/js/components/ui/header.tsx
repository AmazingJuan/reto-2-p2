import { Shield } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Header() {
  return (
    <header className="animate-slide-up fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      {/* Línea decorativa gradiente inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0693e3]/50 to-transparent opacity-50" />
      
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            href={route('home')}
            className="group relative flex items-center gap-3 transition-all duration-300 hover:opacity-90"
          >
            {/* Efecto glow al hover */}
            <div className="absolute inset-0 rounded-xl bg-[#0693e3]/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            
            <img
              src="https://www.trainingcorporation.com.co/wp-content/uploads/thegem-logos/logo_2ca397275eaaf1aa60bbe0bda23053dc_1x.png"
              alt="trainingLogo"
              className="relative h-10 w-auto object-contain drop-shadow-sm"
            />
            <div className="relative">
              <h1 className="text-xl font-bold text-slate-900">
                Training Corporation
              </h1>
            </div>
          </Link>
        </div>
        <Link href={route('dashboard')}>
          <button className="group flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-2 text-slate-700 transition-all duration-300 hover:border-[#0693e3] hover:bg-[#0693e3] hover:text-white hover:shadow-lg hover:shadow-[#0693e3]/20">
            Admin
            <Shield size={18} className="transition-transform duration-300 group-hover:scale-110" />
          </button>
        </Link>
      </div>
    </header>
  );
}