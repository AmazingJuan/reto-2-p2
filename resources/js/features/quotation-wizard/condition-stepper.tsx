import { cn } from '@/lib/utils';
import { useEffect, useId, useState } from 'react';
import { answerError, emptyAnswer, nextConditionId } from './answers';
import type { Answer, OptionsAnswer, PublicCondition, RangeAnswer } from './types';

const inputClass = 'control';

type ConditionControlProps = {
    condition: PublicCondition;
    answer: Answer;
    onChange: (answer: Answer) => void;
    labelId: string;
    errorId?: string;
};

function ConditionControl({ condition, answer, onChange, labelId, errorId }: ConditionControlProps) {
    const inputType = condition.type === 'text' ? 'text' : condition.type;
    const described = { 'aria-describedby': errorId, 'aria-invalid': errorId ? true : undefined };

    if (condition.interaction_type === 'input') {
        return (
            <input
                type={inputType}
                value={answer as string}
                onChange={(e) => onChange(e.target.value)}
                className={inputClass}
                aria-labelledby={labelId}
                {...described}
            />
        );
    }

    if (condition.interaction_type === 'range') {
        const range = answer as RangeAnswer;
        return (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(['min', 'max'] as const).map((bound) => (
                    <label key={bound} className="block">
                        <span className="label">{bound === 'min' ? 'Desde' : 'Hasta'}</span>
                        <input
                            type={inputType}
                            value={range[bound]}
                            onChange={(e) => onChange({ ...range, [bound]: e.target.value })}
                            className={inputClass}
                            {...described}
                        />
                    </label>
                ))}
            </div>
        );
    }

    const value = answer as OptionsAnswer;
    const toggle = (index: number) => {
        const isOn = value.selected.includes(index);
        const selected = condition.multiple ? (isOn ? value.selected.filter((i) => i !== index) : [...value.selected, index]) : [index];
        onChange({ ...value, selected });
    };

    return (
        <div role={condition.multiple ? 'group' : 'radiogroup'} aria-labelledby={labelId} {...described} className="grid gap-2 sm:grid-cols-2">
            {condition.options.map((option, index) => {
                const checked = value.selected.includes(index);
                return (
                    <div key={index} className={cn(option.is_other && checked && 'sm:col-span-2')}>
                        <label className="choice">
                            <input
                                type={condition.multiple ? 'checkbox' : 'radio'}
                                name={labelId}
                                checked={checked}
                                onChange={() => toggle(index)}
                                className={cn(
                                    'h-5 w-5 shrink-0 border-2 border-gris-marca text-azul focus:ring-0 focus:ring-offset-0',
                                    condition.multiple && 'rounded',
                                )}
                            />
                            <span>{option.label}</span>
                        </label>
                        {option.is_other && checked && (
                            <input
                                value={value.other}
                                onChange={(e) => onChange({ ...value, other: e.target.value })}
                                className={cn(inputClass, 'mt-2')}
                                placeholder="Escriba su respuesta"
                                aria-label={`${option.label}: especifique`}
                                autoFocus
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

type ConditionStepperProps = {
    conditions: Record<string, PublicCondition>;
    /** Conditions visited so far; the last one is on screen. */
    path: number[];
    answers: Record<number, Answer>;
    onAnswer: (id: number, answer: Answer) => void;
    onNext: (id: number) => void;
    onBack: () => void;
    onFinish: () => void;
};

/** Shows one question at a time and walks the decision tree. */
export function ConditionStepper({ conditions, path, answers, onAnswer, onNext, onBack, onFinish }: ConditionStepperProps) {
    const currentId = path[path.length - 1];
    const condition = conditions[currentId];
    const [attempted, setAttempted] = useState(false);
    const uid = useId();

    useEffect(() => setAttempted(false), [currentId]);

    if (!condition) {
        return <p className="text-pizarra">Este cuestionario no está disponible en este momento.</p>;
    }

    const answer = answers[currentId] ?? emptyAnswer(condition);
    const error = answerError(condition, answer);
    const nextId = nextConditionId(condition, answer);
    const isLast = nextId === null || !(nextId in conditions);

    const advance = () => {
        if (error) return setAttempted(true);
        if (isLast) onFinish();
        else onNext(nextId);
    };

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                advance();
            }}
            className="panel p-5 sm:p-8"
        >
            <p className="font-display text-sm font-semibold text-azul">Pregunta {path.length}</p>
            <h3
                id={`${uid}-label`}
                className="mt-2 font-display text-[clamp(1.375rem,1.2rem+0.7vw,1.75rem)] font-bold leading-tight tracking-snug text-tinta"
            >
                {condition.label}
            </h3>
            {condition.observation && <p className="mt-3 max-w-measure text-lg leading-relaxed text-pizarra">{condition.observation}</p>}

            <div className="mt-6">
                <ConditionControl
                    condition={condition}
                    answer={answer}
                    onChange={(value) => onAnswer(currentId, value)}
                    labelId={`${uid}-label`}
                    errorId={attempted && error ? `${uid}-error` : undefined}
                />
            </div>

            {attempted && error && (
                <p id={`${uid}-error`} role="alert" className="field-error mt-3">
                    {error}
                </p>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-linea pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={onBack} disabled={path.length <= 1} className="btn btn-outline disabled:hidden sm:disabled:invisible">
                    Pregunta anterior
                </button>
                <button type="submit" className="btn btn-primary">
                    {isLast ? 'Terminar preguntas' : 'Siguiente pregunta'}
                </button>
            </div>
        </form>
    );
}
