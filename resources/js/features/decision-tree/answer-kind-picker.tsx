import { cn } from '@/lib/utils';
import { AlignLeft, Calendar, CalendarRange, CheckSquare, CircleDot, Hash, MoveHorizontal, Type, type LucideIcon } from 'lucide-react';
import { answerKinds, type AnswerKind } from './types';

const icons: Record<AnswerKind, LucideIcon> = {
    single: CircleDot,
    multiple: CheckSquare,
    text: Type,
    'long-text': AlignLeft,
    number: Hash,
    date: Calendar,
    'number-range': MoveHorizontal,
    'date-range': CalendarRange,
};

/** The answer types as visible choices, instead of three technical selects. */
export function AnswerKindPicker({ value, onChange, name }: { value: AnswerKind; onChange: (kind: AnswerKind) => void; name: string }) {
    return (
        <fieldset>
            <legend className="label">¿Cómo responde el cliente?</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {answerKinds.map(({ kind, label, example }) => {
                    const Icon = icons[kind];
                    const checked = value === kind;
                    return (
                        <label
                            key={kind}
                            className={cn(
                                'flex cursor-pointer flex-col gap-1 rounded-control border-2 px-3 py-2.5 transition-colors',
                                checked ? 'border-azul bg-nube' : 'border-linea bg-white hover:border-pizarra',
                            )}
                        >
                            <input type="radio" name={name} value={kind} checked={checked} onChange={() => onChange(kind)} className="sr-only" />
                            <span className={cn('flex items-center gap-2 font-display text-sm font-bold', checked ? 'text-azul' : 'text-tinta')}>
                                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                                {label}
                            </span>
                            <span className="text-xs leading-snug text-pizarra">{example}</span>
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}
