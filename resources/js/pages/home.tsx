import Header from '@/components/ui/header';
import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

type HomePageProps = PageProps & {
    flash?: { success?: string; error?: string };
};

export default function Home() {
    const { props } = usePage<HomePageProps>();
    const successMessage = props.flash?.success;
    const errorMessage = props.flash?.error;
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (successMessage) setShowSuccess(true);
    }, [successMessage]);

    useEffect(() => {
        if (errorMessage) setShowError(true);
    }, [errorMessage]);

    return (
        <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
            <div className="pointer-events-none fixed -right-32 -top-32 h-80 w-80 rounded-full bg-[#0693e3]/12 blur-3xl sm:h-96 sm:w-96" aria-hidden />
            <div
                className="pointer-events-none fixed -bottom-32 -left-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl sm:h-96 sm:w-96"
                style={{ animationDelay: '-4s' }}
                aria-hidden
            />

            <Header />

            {showSuccess && successMessage && (
                <div className="animate-fade-in fixed left-1/2 top-24 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl border border-emerald-200/80 bg-emerald-50/95 px-4 py-3 text-sm text-emerald-900 shadow-lg backdrop-blur-sm sm:top-28">
                    <div className="flex items-start justify-between gap-3">
                        <span>{successMessage}</span>
                        <button
                            type="button"
                            className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-emerald-800 underline-offset-2 hover:bg-emerald-100/80 hover:underline"
                            onClick={() => setShowSuccess(false)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {showError && errorMessage && (
                <div className="animate-fade-in fixed left-1/2 top-24 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl border border-red-200/80 bg-red-50/95 px-4 py-3 text-sm text-red-900 shadow-lg backdrop-blur-sm sm:top-28">
                    <div className="flex items-start justify-between gap-3">
                        <span>{errorMessage}</span>
                        <button
                            type="button"
                            className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-red-800 underline-offset-2 hover:bg-red-100/80 hover:underline"
                            onClick={() => setShowError(false)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            <main className="flex min-h-screen flex-col items-center justify-center px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="animate-fade-in text-4xl font-bold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
                        Bienvenido
                        <br />
                        <span className="text-gradient">Módulo de cotizaciones</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-xl text-base text-slate-600 md:text-lg">
                        Configure su solicitud en pocos pasos
                    </p>

                    <div className="animate-slide-up mt-10 flex flex-col items-center gap-4 sm:mt-12">
                        <Link
                            href={route('quotation.select.business_unit')}
                            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0693e3] px-10 py-6 text-lg font-semibold text-white shadow-lg shadow-[#0693e3]/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0580c7] hover:shadow-xl hover:shadow-[#0693e3]/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0693e3]"
                        >
                            Comenzar cotización
                            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                        </Link>
                        <a
                            href="https://www.trainingcorporation.com.co/portafolio-de-servicios/"
                            className="group inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-500 bg-gray-500 px-8 py-4 text-base font-semibold text-white shadow-md shadow-gray-500/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-600 hover:bg-gray-600 hover:shadow-lg hover:shadow-gray-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
                        >
                            Regresar al portafolio
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
