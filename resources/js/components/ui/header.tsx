import { Shield } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src="https://www.trainingcorporation.com.co/wp-content/uploads/thegem-logos/logo_2ca397275eaaf1aa60bbe0bda23053dc_1x.png"
            alt="trainingLogo"
            className="h-10 w-auto object-contain drop-shadow-sm"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900">Training Corporation</h1>
            <p className="text-xs text-slate-500">Plataforma de Cotizaciones</p>
          </div>
        </div>
        <Link href={route('dashboard')}>
          <Button variant="admin">
            Admin
            <Shield size={18} />
          </Button>
        </Link>
      </div>
    </header>
  );
}