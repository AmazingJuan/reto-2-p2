import Header from '@/components/ui/header';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Blobs decorativos */}
            <div className="blob pointer-events-none fixed -right-40 -top-40 h-96 w-96 rounded-full bg-[#0693e3]/10 blur-3xl" />
            <div className="blob pointer-events-none fixed -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" style={{ animationDelay: '-4s' }} />
            
            <Header />

            <main className="flex min-h-screen items-center justify-center pt-20 pb-20">
                <div className="container mx-auto px-6">
                    <div className="mx-auto max-w-4xl space-y-8 text-center">
                        <h1 className="animate-fade-in text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
                            Bienvenido 
                            <br />
                            <span className="text-gradient">Módulo de cotizaciones</span>
                        </h1>
                        
                        <div className="animate-slide-up flex flex-col items-center space-y-4">
                            <Link href={route('quotation.select.business_unit')}>
                                <button className="group rounded-2xl bg-[#0693e3] px-10 py-7 text-lg text-white shadow-lg shadow-[#0693e3]/30 transition-all duration-300 hover:-translate-y-1 hover:bg-[#047ac0] hover:shadow-xl hover:shadow-[#0693e3]/40">
                                    Comenzar Cotización
                                    <ArrowRight className="ml-2 inline-block h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </button>

                            </Link>
                            <a href="https://www.trainingcorporation.com.co/portafolio-de-servicios/">
                                <button className="group rounded-2xl bg-gray-500 px-8 py-4 text-base text-white shadow-lg shadow-gray-500/30 transition-all duration-300 hover:-translate-y-1 hover:bg-gray-600 hover:shadow-xl hover:shadow-gray-500/40">
                                    Regresar al portafolio
                                    <ArrowRight className="ml-2 inline-block h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}