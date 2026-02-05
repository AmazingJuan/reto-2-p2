import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PageProps } from '@/types';

export default function Home() {
    const { props } = usePage<PageProps<{ flash?: { success?: string } }>>();
    const successMessage = props.flash?.success;
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (successMessage) setShowSuccess(true);
    }, [successMessage]);

    return (
        <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Blobs decorativos */}
            <div className="blob pointer-events-none fixed -right-40 -top-40 h-96 w-96 rounded-full bg-[#0693e3]/10 blur-3xl" />
            <div className="blob pointer-events-none fixed -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" style={{ animationDelay: '-4s' }} />
            
            <Header />

            {successMessage && showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setShowSuccess(false)}
                    />
                    <div className="relative z-10 w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-6 shadow-xl">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                ✓
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">¡Éxito!</h3>
                        </div>
                        <p className="text-slate-700">{successMessage}</p>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowSuccess(false)}
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex min-h-screen items-center justify-center pt-20 pb-20">
                <div className="container mx-auto px-6">
                    <div className="mx-auto max-w-4xl space-y-8 text-center">
                        <h1 className="animate-fade-in text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
                            Bienvenido a <span className="text-gradient">Training Corporation</span>
                        </h1>
                        
                        <div className="animate-slide-up pt-4">
                            <Link href={route('quotation.select.business_unit')}>
                                <button className="group rounded-2xl bg-[#0693e3] px-10 py-7 text-lg text-white shadow-lg shadow-[#0693e3]/30 transition-all duration-300 hover:-translate-y-1 hover:bg-[#047ac0] hover:shadow-xl hover:shadow-[#0693e3]/40">
                                    Comenzar Cotización
                                    <ArrowRight className="ml-2 inline-block h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
