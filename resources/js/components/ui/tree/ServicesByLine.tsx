import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, FileText } from 'lucide-react';

interface ServicesByLineProps {
    line: string;
    services: string[];
    selected?: string[] | null;
    onToggle?: (service: string) => void;
}

export default function ServicesByLine({ line, services, selected, onToggle }: ServicesByLineProps) {
    return (
        <div className="mt-10">
            <h3 className="mb-3 text-center text-2xl font-bold leading-tight text-slate-900 md:text-3xl">
                Servicios de <span className="text-gradient">{line}</span>
            </h3>
            <p className="mb-8 text-center text-slate-600">Selecciona un servicio asociado</p>
            {services.length > 0 ? (
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => {
                        const isSelected = Array.isArray(selected) && selected.includes(service);
                        return (
                            <Card
                                key={service}
                                onClick={() => onToggle?.(service)}
                                className={`animate-slide-up stagger-${index + 1} hover-lift group cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                                    isSelected 
                                        ? 'border-[#0693e3] bg-gradient-to-br from-[#0693e3]/5 to-white shadow-lg shadow-[#0693e3]/20' 
                                        : 'border-slate-200 bg-white hover:border-[#0693e3]/50 hover:shadow-md'
                                }`}
                            >
                                <CardContent className="flex h-24 items-center gap-4 p-4">
                                    {/* Icono */}
                                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                                        isSelected 
                                            ? 'bg-[#0693e3] text-white shadow-lg shadow-[#0693e3]/30' 
                                            : 'bg-slate-100 text-slate-500 group-hover:bg-[#0693e3]/10 group-hover:text-[#0693e3]'
                                    }`}>
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    
                                    <p className="flex-1 text-base font-medium text-slate-900">{service}</p>
                                    
                                    {isSelected && <CheckCircle2 className="h-6 w-6 shrink-0 text-[#0693e3]" />}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-slate-500">No hay servicios disponibles para esta línea.</p>
            )}
        </div>
    );
}
