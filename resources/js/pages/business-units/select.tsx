import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import GoHome from '@/components/ui/gohome';
import Header from '@/components/ui/header';
import { PageProps } from '@inertiajs/core';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Briefcase, ClipboardCheck, GraduationCap, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BusinessUnit {
    name: string;
    display_name: string;
}

type SelectPageProps = PageProps & {
    viewData: {
        businessUnits: BusinessUnit[];
    };
    flash?: {
        error?: string;
    };
};

// Configuración de iconos y colores por tipo de unidad
const getUnitConfig = (name: string) => {
    const configs: Record<string, { icon: any; gradient: string; accent: string }> = {
        auditoria: { 
            icon: ClipboardCheck, 
            gradient: 'from-[#0693e3]/10 to-[#0693e3]/5', 
            accent: '#0693e3' 
        },
        consultoria: { 
            icon: Briefcase, 
            gradient: 'from-emerald-500/10 to-emerald-500/5', 
            accent: '#10b981' 
        },
        formacion: { 
            icon: GraduationCap, 
            gradient: 'from-[#0693e3]/10 to-emerald-500/10', 
            accent: '#0693e3' 
        },
    };
    const key = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return configs[key] || { icon: BookOpen, gradient: 'from-slate-100 to-slate-50', accent: '#0693e3' };
};

export default function SelectBusinessUnits() {
    const { viewData, flash } = usePage<SelectPageProps>().props;
    const error = flash?.error ?? '';
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (error) {
            setShowError(true);
        }
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Blobs decorativos */}
            <div className="blob pointer-events-none fixed -right-40 -top-40 h-96 w-96 rounded-full bg-[#0693e3]/10 blur-3xl" />
            <div className="blob pointer-events-none fixed -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" style={{ animationDelay: '-4s' }} />
            
            <Header />
            <GoHome />

            <main className="flex-1 px-6 pb-24 pt-5">
                <div className="container mx-auto">
                    <div className="mx-auto mb-12 max-w-4xl space-y-4 text-center">
                        <Badge className="mb-6 border border-[#0693e3]/20 bg-gradient-to-r from-[#0693e3]/10 to-emerald-500/10 px-5 py-2 text-slate-700">
                            Paso 1 de 3
                        </Badge>
                        <h2 className="animate-slide-up text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                            Selecciona la{' '}
                            <span className="text-gradient">unidad de negocio</span>
                        </h2>
                    </div>

                    {error && showError && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                            <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 shadow-xl">
                                <div className="mb-4 text-lg font-semibold text-red-700">Error</div>
                                <p className="mb-6 text-slate-800">{error}</p>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowError(false)}
                                        className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {viewData.businessUnits.length === 0 ? (
                        <div className="mt-10 rounded-xl border border-[#0693e3]/20 bg-[#0693e3]/5 p-6 text-center text-[#0693e3]">
                            No hay unidades de negocio disponibles en este momento.
                        </div>
                    ) : (
                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {viewData.businessUnits.map((unit, i) => {
                                const config = getUnitConfig(unit.name);
                                const Icon = config.icon;
                                
                                return (
                                    <Link key={i} href={route('quotation.quote.business_unit', unit.name)}>
                                        <Card className={`animate-slide-up stagger-${i + 1} card-shine hover-lift group relative h-56 cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm`}>
                                            {/* Círculo decorativo que crece al hover */}
                                            <div 
                                                className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${config.gradient} transition-transform duration-500 group-hover:scale-150`}
                                            />
                                            
                                            <CardContent className="relative flex h-full flex-col items-center justify-center px-6 text-center">
                                                {/* Icono */}
                                                <div 
                                                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110"
                                                    style={{ backgroundColor: `${config.accent}15` }}
                                                >
                                                    <Icon 
                                                        className="h-8 w-8 transition-colors duration-300"
                                                        style={{ color: config.accent }}
                                                    />
                                                </div>
                                                
                                                <CardTitle className="mb-3 text-2xl font-semibold tracking-wide text-slate-800 transition-colors group-hover:text-[#0693e3]">
                                                    {unit.display_name}
                                                </CardTitle>
                                                
                                                {/* Flecha que aparece al hover */}
                                                <div className="flex items-center gap-1 text-sm font-medium text-slate-400 opacity-0 transition-all duration-300 group-hover:text-[#0693e3] group-hover:opacity-100">
                                                    Seleccionar
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
