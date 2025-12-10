import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import { Link } from '@inertiajs/react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <Header />

            <main className="pt-40">
                <section className="container mx-auto px-6 py-20">
                    <div className="mx-auto max-w-4xl space-y-6 text-center">
                        <Badge variant="secondary" className="mb-4 bg-slate-100 px-4 py-1 text-slate-700">
                            Solución Empresarial de Cotizaciones
                        </Badge>
                        <h2 className="text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
                            Solicita tus cotizaciones con precisión y rapidez
                        </h2>
                        <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
                            <Link href={route('quotation.select.business_unit')}>
                                <Button size="lg" variant="training">
                                    Comenzar Cotización
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
