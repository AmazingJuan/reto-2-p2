import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Footer from '@/components/ui/footer';
import GoHome from '@/components/ui/gohome';
import Header from '@/components/ui/header';
import { PageProps } from '@inertiajs/core';
import { Link, usePage } from '@inertiajs/react';

type SelectPageProps = PageProps & {
    viewData: {
        businessUnits: string[];
    };
    flash?: {
        error?: string;
    };
};

export default function SelectBusinessUnits() {
    const { viewData, flash } = usePage<SelectPageProps>().props;
    const error = flash?.error ?? '';
    const [showError, setShowError] = useState(Boolean(error));
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <Header />
            <GoHome />

            <main className="flex-1 px-6 pb-20 pt-5">
                <div className="container mx-auto">
                    <div className="mx-auto mb-20 max-w-4xl space-y-6 text-center">
                        <Badge variant="secondary" className="mb-4 justify-center bg-slate-100 px-4 py-1 text-center text-slate-700">
                            Unidad de negocio
                        </Badge>
                        <h2 className="text-5xl font-bold leading-tight text-slate-900 md:text-5xl">Selecciona la unidad de negocio deseada</h2>
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
                        <div className="border-bg-[#0693e3] mt-10 rounded-xl border bg-blue-50 p-6 text-center text-[#0693e3]">
                            No hay unidades de negocio disponibles en este momento.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                            {viewData.businessUnits.map((unit, i) => (
                                <Link key={i} href={route('quotation.quote.business_unit', unit)}>
                                    <Card className="group relative h-44 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                                        <div className="absolute inset-0 rounded-2xl border border-transparent transition-all group-hover:border-[#0693e3]" />

                                        <CardContent className="flex h-full flex-col items-center justify-center px-4 text-center">
                                            <CardTitle className="text-2xl font-semibold tracking-wide text-slate-800 transition-colors group-hover:text-[#0693e3]">
                                                {unit.charAt(0).toUpperCase() + unit.slice(1).toLowerCase()}
                                            </CardTitle>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
