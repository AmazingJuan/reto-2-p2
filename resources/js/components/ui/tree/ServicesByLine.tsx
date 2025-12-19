import { Card, CardContent } from '@/components/ui/card';

interface ServicesByLineProps {
    line: string;
    services: string[];
}

export default function ServicesByLine({ line, services }: ServicesByLineProps) {
    return (
        <div className="mt-10">
            <h3 className="mb-6 text-center text-2xl font-bold leading-tight text-slate-900 md:text-2xl">Servicios de {line}</h3>
            <p className="mb-6 text-center text-slate-600">Selecciona una servicio asociado</p>
            {services.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <Card key={service} className="cursor-pointer border-2 border-slate-200 transition hover:border-blue-500 hover:bg-blue-50 bg-white">
                            <CardContent className="p-4">
                                <p className="text-base font-medium text-slate-900 ">{service}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-slate-500">No hay servicios disponibles para esta línea.</p>
            )}
        </div>
    );
}
