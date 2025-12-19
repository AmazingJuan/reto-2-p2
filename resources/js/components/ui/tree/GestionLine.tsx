import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, GitBranch } from 'lucide-react';
import { useState } from 'react';
import Footer from '../footer';
import GoSelect from '../goselect';
import Header from '../header';
import ServicesByLine from './ServicesByLine';

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

    const visibleLines = viewData.gestionLines.filter((line) => (viewData.services[line]?.length ?? 0) > 0);

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <Header />
            <GoSelect />

            <main className="container mx-auto flex-1 px-4 pb-12 pt-4">
                {/* Título */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <GitBranch className="h-5 w-5 text-blue-600" />
                    </div>

                    <h2 className="mb-2 text-3xl font-bold text-slate-900 md:text-4xl">{capitalize(viewData.businessUnit)}</h2>

                    <p className="mx-auto max-w-xl text-m text-slate-600">Selecciona una línea de gestión para ver sus servicios</p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleLines.map((line) => {
                        const isSelected = selectedLine === line;
                        const servicesCount = viewData.services[line].length;

                        return (
                            <Card
                                key={line}
                                onClick={() => setSelectedLine(line)}
                                className={`cursor-pointer border transition-all ${
                                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
                                }`}
                            >
                                <CardContent className="p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <h3 className="text-base font-medium text-slate-900">{capitalize(line)}</h3>

                                        {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                      })}
                </div>
                      {/* Servicios */}
                      {selectedLine && (
                          <div className="animate-fade-in mt-10">
                              <ServicesByLine line={selectedLine} services={viewData.services[selectedLine]} />
                          </div>
                      )}

            </main>

            <Footer />
        </div>
    );
}
