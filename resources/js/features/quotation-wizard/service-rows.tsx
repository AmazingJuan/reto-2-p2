import { capitalize, pluralize } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Check, Plus } from 'lucide-react';

type ServiceRowsProps = {
    line: string | null;
    services: string[];
    selected: string[];
    onToggle: (service: string) => void;
};

/** Services of a line with the corporate site's "+ Agregar" toggle. */
export function ServiceRows({ line, services, selected, onToggle }: ServiceRowsProps) {
    if (!line) {
        return (
            <div className="flex h-full min-h-[12rem] items-center rounded-[10px] border-2 border-dashed border-linea p-8">
                <p className="max-w-sm text-pizarra">Elija una línea para ver sus servicios y agregar los que le interesen.</p>
            </div>
        );
    }

    return (
        <div>
            <p className="mb-3 text-base font-semibold text-pizarra">
                {pluralize(services.length, 'servicio', 'servicios')}. Agregue los que le interesen; puede combinar servicios de varias líneas.
            </p>
            <h2 className="subheading text-azul">{capitalize(line)}</h2>
            <ul className="mt-3 border-t border-linea">
                {services.map((service) => {
                    const added = selected.includes(service);
                    return (
                        <li key={service} className="flex items-center gap-4 border-b border-linea py-3.5 pl-4">
                            <span className={cn('min-w-0 flex-1 text-lg leading-snug', added && 'font-semibold')}>{service}</span>
                            <button
                                type="button"
                                aria-pressed={added}
                                onClick={() => onToggle(service)}
                                className={cn(
                                    'inline-flex min-h-[2.75rem] min-w-[2.75rem] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border-2 px-3.5 font-display text-[0.8125rem] font-bold transition-colors',
                                    added ? 'border-azul bg-azul text-white' : 'border-linea text-azul hover:border-azul',
                                )}
                            >
                                {added ? <Check className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
                                <span className="max-sm:sr-only">{added ? 'Agregado' : 'Agregar'}</span>
                                <span className="sr-only"> a la solicitud: {service}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
