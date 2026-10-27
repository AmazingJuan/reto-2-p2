import { cn } from '@/lib/utils';
import { FileText, X } from 'lucide-react';
import { emptyAnswer } from './answers';
import { ACCEPT, formatSize } from './documents';
import type { Answer, FilesAnswer, OptionsAnswer, PublicCondition, RangeAnswer } from './types';

type ConditionFieldProps = {
    id: number;
    condition: PublicCondition;
    answer: Answer | undefined;
    onChange: (answer: Answer) => void;
    error: string | null;
};

/** Id of the element a field's error links to (the summary focuses it). */
export const fieldAnchor = (id: number) => `field-${id}`;

/**
 * One question of the encuadre, built like the corporate site's UiField: the
 * label always visible with an explicit "(opcional)", the control, then the
 * help and the error, both wired with aria-describedby.
 */
export function ConditionField({ id, condition, answer, onChange, error }: ConditionFieldProps) {
    const anchor = fieldAnchor(id);
    const value = answer ?? emptyAnswer(condition);
    const describedBy = [condition.observation && `${anchor}-help`, error && `${anchor}-error`].filter(Boolean).join(' ') || undefined;
    const aria = { 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined };
    const isGroup = condition.interaction_type !== 'input';

    const label = (
        <>
            {condition.label} {!condition.required && <span className="font-normal text-pizarra">(opcional)</span>}
        </>
    );

    return (
        <div id={anchor} className="grid gap-2">
            {isGroup ? (
                <p id={`${anchor}-label`} className="font-bold">
                    {label}
                </p>
            ) : (
                <label htmlFor={`${anchor}-input`} className="font-bold">
                    {label}
                </label>
            )}

            <Control anchor={anchor} condition={condition} value={value} onChange={onChange} aria={aria} invalid={!!error} />

            {condition.observation && (
                <p id={`${anchor}-help`} className="max-w-measure text-sm text-pizarra">
                    {condition.observation}
                </p>
            )}
            {error && (
                <p id={`${anchor}-error`} className="text-sm font-bold text-error">
                    {error}
                </p>
            )}
        </div>
    );
}

type ControlProps = {
    anchor: string;
    condition: PublicCondition;
    value: Answer;
    onChange: (answer: Answer) => void;
    aria: { 'aria-describedby'?: string; 'aria-invalid'?: boolean };
    invalid: boolean;
};

function Control({ anchor, condition, value, onChange, aria, invalid }: ControlProps) {
    const placeholder = condition.placeholder ?? undefined;

    if (condition.interaction_type === 'input') {
        if (condition.type === 'file') {
            return <FilesControl anchor={anchor} label={condition.label} files={value as FilesAnswer} onChange={onChange} aria={aria} />;
        }
        if (condition.type === 'text' && condition.multiline) {
            return (
                <textarea
                    id={`${anchor}-input`}
                    value={value as string}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={5}
                    className="control resize-y"
                    {...aria}
                />
            );
        }
        return (
            <input
                id={`${anchor}-input`}
                type={condition.type}
                inputMode={condition.type === 'number' ? 'decimal' : undefined}
                value={value as string}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn('control', condition.type !== 'text' && 'sm:max-w-xs')}
                {...aria}
            />
        );
    }

    if (condition.interaction_type === 'range') {
        const range = value as RangeAnswer;
        return (
            <div role="group" aria-labelledby={`${anchor}-label`} className="grid grid-cols-1 gap-3 sm:max-w-lg sm:grid-cols-2" {...aria}>
                {(['min', 'max'] as const).map((bound) => (
                    <label key={bound} className="grid gap-1">
                        <span className="text-sm text-pizarra">{bound === 'min' ? 'Desde' : 'Hasta'}</span>
                        <input
                            type={condition.type}
                            value={range[bound]}
                            onChange={(e) => onChange({ ...range, [bound]: e.target.value })}
                            className="control"
                            aria-invalid={invalid || undefined}
                        />
                    </label>
                ))}
            </div>
        );
    }

    const options = value as OptionsAnswer;
    const toggle = (index: number) => {
        const isOn = options.selected.includes(index);
        const selected = condition.multiple ? (isOn ? options.selected.filter((i) => i !== index) : [...options.selected, index]) : [index];
        onChange({ ...options, selected });
    };
    const otherChosen = options.selected.some((i) => condition.options[i]?.is_other);

    // Bordered options, as the contact form's "¿Qué necesita?". A few short ones (Sí / No,
    // Presencial / Virtual / Mixto) share the row and wrap only when it is too narrow;
    // the rest go two per row (three when there are exactly three).
    const inline = condition.options.length <= 3 && condition.options.every((o) => o.label.length <= 12);
    const layout = inline ? 'flex flex-wrap' : cn('grid', condition.options.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2');

    return (
        <div role={condition.multiple ? 'group' : 'radiogroup'} aria-labelledby={`${anchor}-label`} {...aria}>
            <div className={cn('gap-2', layout)}>
                {condition.options.map((option, index) => (
                    <label
                        key={index}
                        className={cn(
                            'choice has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-azul-vivo',
                            inline && 'w-auto flex-[1_1_0] whitespace-nowrap max-sm:gap-2 max-sm:px-3',
                            invalid && !options.selected.length && 'border-error',
                        )}
                    >
                        <input
                            type={condition.multiple ? 'checkbox' : 'radio'}
                            name={anchor}
                            checked={options.selected.includes(index)}
                            onChange={() => toggle(index)}
                            className={cn(
                                'h-5 w-5 shrink-0 border-2 border-gris-marca text-azul focus:ring-0 focus:ring-offset-0',
                                condition.multiple && 'rounded',
                            )}
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
            </div>
            {otherChosen && (
                <input
                    value={options.other}
                    onChange={(e) => onChange({ ...options, other: e.target.value })}
                    className="control mt-2"
                    placeholder="Especifique"
                    aria-label={`${condition.label}: especifique`}
                />
            )}
        </div>
    );
}

type FilesControlProps = Pick<ControlProps, 'anchor' | 'onChange' | 'aria'> & { label: string; files: FilesAnswer };

/**
 * The documents of the request: each pick adds to the list (choosing again
 * does not drop what was already attached) and every file can be removed.
 */
function FilesControl({ anchor, label, files, onChange, aria }: FilesControlProps) {
    const add = (picked: FileList | null) => {
        const isNew = (file: File) => !files.some((f) => f.name === file.name && f.size === file.size);
        onChange([...files, ...Array.from(picked ?? []).filter(isNew)]);
    };

    return (
        <div className="grid gap-3">
            <input
                id={`${anchor}-input`}
                type="file"
                multiple
                accept={ACCEPT}
                onChange={(e) => {
                    add(e.target.files);
                    e.target.value = ''; // so the same file can be picked again after removing it
                }}
                className="block w-full text-base text-pizarra file:mr-4 file:cursor-pointer file:rounded-[10px] file:border-2 file:border-azul file:bg-white file:px-5 file:py-2.5 file:font-display file:font-bold file:text-azul hover:file:bg-nube"
                {...aria}
            />
            {files.length > 0 && (
                <ul className="grid gap-2" aria-label={`${label}: documentos adjuntos`}>
                    {files.map((file, index) => (
                        <li key={`${file.name}-${file.size}`} className="flex items-center gap-3 rounded-[10px] border-2 border-linea px-4 py-2.5">
                            <FileText className="h-5 w-5 shrink-0 text-azul" aria-hidden />
                            <span className="min-w-0 flex-1 truncate">{file.name}</span>
                            <span className="shrink-0 text-sm text-pizarra">{formatSize(file.size)}</span>
                            <button
                                type="button"
                                onClick={() => onChange(files.filter((_, i) => i !== index))}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-pizarra hover:bg-nube hover:text-error"
                                aria-label={`Quitar ${file.name}`}
                            >
                                <X className="h-4 w-4" aria-hidden />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <p className="text-sm text-pizarra">Los documentos no se guardan en este navegador: si sale de la página, adjúntelos de nuevo.</p>
        </div>
    );
}
