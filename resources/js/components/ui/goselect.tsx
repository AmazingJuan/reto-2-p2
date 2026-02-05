import { Link } from '@inertiajs/react';
import { ArrowLeft, LayoutGrid } from "lucide-react";

export default function GoSelect({ href = "/cotizar", label = "Unidades" }) {
    return (
        <div className="animate-slide-in-left ml-6 mt-24">
            <Link href={href}>
                <button className="group flex items-center gap-3 rounded-xl border-2 border-slate-200 bg-white/80 px-5 py-2.5 text-slate-600 backdrop-blur-sm transition-all duration-300 hover:-translate-x-1 hover:border-emerald-500 hover:bg-emerald-500/5 hover:text-emerald-600 hover:shadow-lg hover:shadow-emerald-500/10">
                    <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    <LayoutGrid className="h-4 w-4" />
                    <span className="font-medium">{label}</span>
                </button>
            </Link>
        </div>
    );
}