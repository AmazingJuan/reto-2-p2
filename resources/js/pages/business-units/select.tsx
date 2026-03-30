import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import GoHome from '@/components/ui/gohome';
import Header from '@/components/ui/header';
import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, BookOpen, Briefcase, ClipboardCheck, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BusinessUnit {
    name: string;
    display_name: string;
}

type SelectPageProps = PageProps<{
    viewData: {
        businessUnits: BusinessUnit[];
    };
    flash?: {
        error?: string;
    };
}>;

const getUnitConfig = (name: string) => {
    const configs: Record<string, { icon: typeof Briefcase; gradient: string; accent: string }> = {
        auditoria: {
            icon: ClipboardCheck,
            gradient: 'from-[#0693e3]/20 to-[#0693e3]/5',
            accent: '#0693e3',
        },
        consultoria: {
            icon: Briefcase,
            gradient: 'from-emerald-500/20 to-emerald-500/5',
            accent: '#10b981',
        },
        formacion: {
            icon: GraduationCap,
            gradient: 'from-[#0693e3]/15 to-emerald-500/10',
            accent: '#0693e3',
        },
    };
    const key = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return configs[key] || { icon: BookOpen, gradient: 'from-slate-200/80 to-slate-50', accent: '#0693e3' };
};

export default function SelectBusinessUnits() {
    const { viewData, flash } = usePage<SelectPageProps>().props;
    const error = flash?.error ?? '';
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (error) setShowError(true);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <div className="pointer-events-none fixed -right-32 -top-32 h-80 w-80 rounded-full bg-[#0693e3]/12 blur-3xl sm:h-96 sm:w-96" aria-hidden />
            <div
                className="pointer-events-none fixed -bottom-32 -left-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl sm:h-96 sm:w-96"
                style={{ animationDelay: '-4s' }}
                aria-hidden
            />

            <Header />

            <main className="flex-1 px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-8">
                        <GoHome />
                    </div>

                    <div className="mx-auto mb-12 max-w-4xl space-y-4 text-center">
                        <Badge className="mb-2 border border-[#0693e3]/25 bg-gradient-to-r from-[#0693e3]/12 to-emerald-500/10 px-5 py-2 text-slate-700 shadow-sm">
                            Paso 1 de 3
                        </Badge>
                        <h2 className="animate-slide-up text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
                            Selecciona la{' '}
                            <span className="text-gradient">unidad de negocio</span>
                        </h2>
                        <p className="mx-auto max-w-2xl text-slate-600">El siguiente paso le permitirá elegir línea de gestión y servicios.</p>
                    </div>

                    {error && showError && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                            <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-2xl">
                                <div className="mb-2 text-lg font-semibold text-red-700">Error</div>
                                <p className="mb-6 text-slate-700">{error}</p>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowError(false)}
                                        className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-red-700"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {viewData.businessUnits.length === 0 ? (
                        <div className="mt-8 rounded-2xl border border-[#0693e3]/25 bg-gradient-to-br from-[#0693e3]/8 to-white px-6 py-10 text-center text-[#047ac0] shadow-inner">
                            No hay unidades de negocio disponibles en este momento.
                        </div>
                    ) : (
                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {viewData.businessUnits.map((unit, i) => {
                                const config = getUnitConfig(unit.name);
                                const Icon = config.icon;
                                const staggerClass = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5'][Math.min(i, 4)];

                                return (
                                    <Link key={unit.name} href={route('quotation.quote.business_unit', unit.name)} className="block h-full">
                                        <Card
                                            className={`card-shine hover-lift group relative h-56 cursor-pointer overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-md transition-shadow duration-300 hover:shadow-xl animate-slide-up ${staggerClass}`}
                                        >
                                            <div
                                                className={`absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br ${config.gradient} transition-transform duration-500 group-hover:scale-125`}
                                                aria-hidden
                                            />

                                            <CardContent className="relative flex h-full flex-col items-center justify-center px-6 text-center">
                                                <div
                                                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm transition-all duration-300 group-hover:scale-105"
                                                    style={{ backgroundColor: `${config.accent}18` }}
                                                >
                                                    <Icon className="h-8 w-8 transition-colors duration-300" style={{ color: config.accent }} />
                                                </div>

                                                <CardTitle className="mb-3 text-xl font-semibold tracking-tight text-slate-800 transition-colors group-hover:text-[#0693e3] sm:text-2xl">
                                                    {unit.display_name}
                                                </CardTitle>

                                                <div className="flex items-center gap-1 text-sm font-semibold text-slate-400 opacity-0 transition-all duration-300 group-hover:text-[#0693e3] group-hover:opacity-100">
                                                    Seleccionar
                                                    <ArrowRight className="h-4 w-4" aria-hidden />
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
