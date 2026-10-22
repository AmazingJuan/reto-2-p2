import { capitalize } from '@/lib/format';
import { cn } from '@/lib/utils';

type LineListProps = {
    lines: string[];
    counts: Record<string, number>;
    /** Services already added from each line. */
    picked: Record<string, number>;
    selected: string | null;
    onSelect: (line: string) => void;
};

/** "Elija la línea", as in the corporate service explorer. */
export function LineList({ lines, counts, picked, selected, onSelect }: LineListProps) {
    return (
        <div>
            <h2 id="lineas" className="mb-3 font-sans text-base font-bold tracking-normal text-tinta">
                Elija la línea
            </h2>
            <ul className="grid gap-2" aria-labelledby="lineas">
                {lines.map((line) => {
                    const active = line === selected;
                    return (
                        <li key={line}>
                            <button
                                type="button"
                                aria-pressed={active}
                                onClick={() => onSelect(line)}
                                className={cn(
                                    'flex w-full items-center justify-between gap-3 rounded-control border-2 px-4 py-3 text-left font-display text-[1.0625rem] font-bold leading-snug transition-colors',
                                    active ? 'border-azul bg-azul text-white' : 'border-linea bg-white text-tinta hover:border-pizarra',
                                )}
                            >
                                <span className="min-w-0">
                                    {capitalize(line)}
                                    {picked[line] > 0 && (
                                        <span className={cn('mt-0.5 block font-sans text-sm font-semibold', active ? 'text-white/90' : 'text-azul')}>
                                            {picked[line] === 1 ? '1 agregado' : `${picked[line]} agregados`}
                                        </span>
                                    )}
                                </span>
                                <span
                                    className={cn(
                                        'flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-2 text-xs font-bold tabular-nums',
                                        active ? 'bg-noche/60 text-white' : 'bg-nube text-azul',
                                    )}
                                >
                                    {counts[line] ?? 0}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
