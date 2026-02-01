import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface ServicesByLineProps {
    line: string;
    services: string[];
    selected?: string[] | null;
    onToggle?: (service: string) => void;
}

export default function ServicesByLine({ line, services, selected, onToggle }: ServicesByLineProps) {
    return (
        <div className="mt-10">
            <h3 className="mb-6 text-center text-2xl font-bold leading-tight text-slate-900 md:text-2xl">Servicios de {line}</h3>
            <p className="mb-6 text-center text-slate-600">Selecciona una servicio asociado</p>
            {services.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => {
                        const isSelected = Array.isArray(selected) && selected.includes(service);
                        return (
                            <Card
                                key={service}
                                onClick={() => onToggle?.(service)}
                                className={`cursor-pointer border-2 transition bg-white ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-500 hover:bg-blue-50'}`}>
                                <CardContent className="p-4 flex items-center justify-between h-24">
                                    <p className="text-base font-medium text-slate-900 truncate">{service}</p>
                                    {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <p className="text-slate-500">No hay servicios disponibles para esta línea.</p>
            )}
        </div>
    );
}
