import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Shield } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://www.trainingcorporation.com.co/wp-content/uploads/thegem-logos/logo_2ca397275eaaf1aa60bbe0bda23053dc_1x.png"
                            alt="trainingLogo"
                            className='h-10 w-auto object-contain drop-shadow-sm'
                        />
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Training Corporation</h1>
                            <p className="text-xs text-slate-500">Plataforma de Cotizaciones</p>
                        </div>
                    </div>
                    <Link href={ route('dashboard') }>
                    <Button variant="admin">
                        Admin
                        <Shield size={18} />
                    </Button>
                    </Link>
                </div>
            </header>

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
                            <Link href={ route('quotation.index') }>
                            <Button size="lg" variant="training">
                                Comenzar Cotización
                            </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 flex h-14 items-center border-t border-slate-200 bg-white">
                <div className="container mx-auto flex h-full items-center px-6">
                    <span className="text-sm text-slate-600">© 2025 Training Corporation. Todos los derechos reservados.</span>
                </div>
            </footer>
        </div>
    );
}
