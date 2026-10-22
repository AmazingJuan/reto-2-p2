import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const STEPS = [
    { label: 'Servicios', hint: 'Línea y servicios' },
    { label: 'Preguntas', hint: 'Sobre su organización' },
    { label: 'Sus datos', hint: 'Para enviarle la propuesta' },
] as const;

/** Progress bar styled like the corporate site's mode tabs. `current` is 1-based. */
export function WizardSteps({ current }: { current: number }) {
    return (
        <div className="border-b border-linea">
            <ol className="frame flex gap-5 overflow-x-auto sm:gap-10" aria-label="Pasos de la solicitud">
                {STEPS.map((step, index) => {
                    const number = index + 1;
                    const done = number < current;
                    const active = number === current;
                    return (
                        <li
                            key={step.label}
                            aria-current={active ? 'step' : undefined}
                            className={cn(
                                'relative shrink-0 pb-4 pt-1',
                                active && 'after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:rounded-t after:bg-azul',
                            )}
                        >
                            <span
                                className={cn(
                                    'flex items-center gap-1.5 whitespace-nowrap font-display text-base font-bold tracking-snug sm:gap-2 sm:text-xl',
                                    active ? 'text-azul' : done ? 'text-tinta' : 'text-pizarra',
                                )}
                            >
                                {done ? (
                                    <Check className="h-5 w-5 text-azul" aria-label="Completado:" />
                                ) : (
                                    <span className="text-base tabular-nums" aria-hidden>
                                        {number}.
                                    </span>
                                )}
                                {step.label}
                            </span>
                            <span className="mt-0.5 hidden font-display text-xs font-semibold text-pizarra sm:block">{step.hint}</span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
