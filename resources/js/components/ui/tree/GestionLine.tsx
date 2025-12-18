import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ChevronRight, GitBranch } from 'lucide-react';
import { useState } from 'react';
import Footer from '../footer';
import Header from '../header';
import ServicesByLine from './ServicesByLine';
import GoSelect from '../goselect';

interface ViewData {
    businessUnit: string;
    gestionLines: string[];
    services: {
        [gestionLine: string]: string[];
    };
}

interface GestionLineProps {
    viewData: ViewData;
}

export default function GestionLine({ viewData }: GestionLineProps) {
    const [selectedLine, setSelectedLine] = useState<string | null>(null);
    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-slate-100">
            <Header />
            <GoSelect />

            <main className="container mx-auto flex-1 px-6 pb-16 pt-4">
                <div className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-100 p-3">
                        <GitBranch className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-4xl">
                        {capitalize(viewData.businessUnit)}
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-slate-600">
                        Selecciona una línea de gestión para explorar los servicios disponibles
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {viewData.gestionLines.map((line, index) => (
                        <Card
                            key={line}
                            onClick={() => setSelectedLine(line)}
                            className={`group relative cursor-pointer overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                                selectedLine === line
                                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-lg ring-2 ring-blue-200'
                                    : 'border-slate-200 bg-white hover:border-blue-300'
                            }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {selectedLine === line && (
                                <div className="absolute right-4 top-4">
                                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                                </div>
                            )}

                            <div
                                className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity duration-300 ${
                                    selectedLine === line ? 'opacity-100' : 'group-hover:opacity-100'
                                }`}
                            />

                            <CardContent className="relative p-4">
                                <div className="mb-3 flex items-start justify-between">
                                    <div
                                        className={`rounded-lg p-2 transition-colors ${
                                            selectedLine === line ? 'bg-blue-100' : 'bg-slate-100 group-hover:bg-blue-50'
                                        }`}
                                    >
                                        <GitBranch
                                            className={`h-5 w-5 transition-colors ${
                                                selectedLine === line ? 'text-blue-600' : 'text-slate-600 group-hover:text-blue-500'
                                            }`}
                                        />
                                    </div>
                                </div>

                                <h3 className="mb-2 text-xl font-semibold leading-snug text-slate-900">{line}</h3>

                                {viewData.services[line] && (
                                    <p className="text-sm text-slate-500">
                                        {viewData.services[line].length} {viewData.services[line].length === 1 ? 'servicio' : 'servicios'}
                                    </p>
                                )}

                                <div
                                    className={`mt-4 flex items-center text-sm font-medium transition-colors ${
                                        selectedLine === line ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'
                                    }`}
                                >
                                    Ver servicios
                                    <ChevronRight
                                        className={`ml-1 h-4 w-4 transition-transform ${
                                            selectedLine === line ? 'translate-x-1' : 'group-hover:translate-x-1'
                                        }`}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {selectedLine && (
                    <div className="animate-fade-in mt-12">
                        <ServicesByLine line={selectedLine} services={viewData.services[selectedLine] ?? []} />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
