import { Link } from '@inertiajs/react';
import { ArrowLeft, Home } from 'lucide-react';

export default function GoHome({ href = '/', label = 'Inicio' }) {
    return (
        <Link
            href={href}
            className="group inline-flex items-center gap-3 rounded-xl border-2 border-slate-200/90 bg-white/90 px-5 py-2.5 text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-x-0.5 hover:border-[#0693e3] hover:bg-white hover:text-[#0693e3] hover:shadow-md hover:shadow-[#0693e3]/15"
        >
            <ArrowLeft className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden />
            <Home className="h-4 w-4 shrink-0 opacity-70 group-hover:opacity-100" aria-hidden />
            <span className="font-medium">{label}</span>
        </Link>
    );
}
