import { Link } from '@inertiajs/react';
import { ArrowLeft, Home } from "lucide-react";

export default function GoHome({ href = "/", label = "Inicio" }) {
    return (
        <div className="animate-slide-in-left ml-6 mt-24">
            <Link href={href}>
                <button className="group flex items-center gap-3 rounded-xl border-2 border-slate-200 bg-white/80 px-5 py-2.5 text-slate-600 backdrop-blur-sm transition-all duration-300 hover:-translate-x-1 hover:border-[#0693e3] hover:bg-[#0693e3]/5 hover:text-[#0693e3] hover:shadow-lg hover:shadow-[#0693e3]/10">
                    <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    <Home className="h-4 w-4" />
                    <span className="font-medium">{label}</span>
                </button>
            </Link>
        </div>
    );
}