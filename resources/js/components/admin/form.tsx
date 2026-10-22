import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { cloneElement, isValidElement, type FormEvent, type ReactElement, type ReactNode } from 'react';
import { adminCardClass, adminFieldLabelClass, adminOutlineButtonClass, adminPrimaryButtonClass } from './styles';

type FormCardProps = {
    onSubmit: () => void;
    children: ReactNode;
    className?: string;
};

/** White card wrapping a form; prevents the native submit. */
export function FormCard({ onSubmit, children, className }: FormCardProps) {
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} noValidate className={cn(adminCardClass, 'space-y-6 p-5 sm:p-8', className)}>
            {children}
        </form>
    );
}

type FormFieldProps = {
    id: string;
    label: ReactNode;
    required?: boolean;
    hint?: ReactNode;
    error?: string;
    className?: string;
    /** The control. Receives `id`, `aria-invalid` and `aria-describedby`. */
    children: ReactElement;
};

/** Label + control + hint + error, wired for screen readers. */
export function FormField({ id, label, required, hint, error, className, children }: FormFieldProps) {
    const hintId = hint ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

    const control = isValidElement(children)
        ? cloneElement(children as ReactElement<Record<string, unknown>>, {
              id,
              'aria-invalid': error ? true : undefined,
              'aria-describedby': describedBy,
          })
        : children;

    return (
        <div className={className}>
            <label htmlFor={id} className={adminFieldLabelClass}>
                {label} {!required && <span className="label-optional">(opcional)</span>}
            </label>
            {hint && (
                <p id={hintId} className="hint mb-2">
                    {hint}
                </p>
            )}
            {control}
            {error && (
                <p id={errorId} className="field-error mt-2" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

type FormActionsProps = {
    processing: boolean;
    submitLabel: string;
    processingLabel?: string;
    /** Where "Cancelar" goes; omit to hide the button. */
    cancelHref?: string;
};

export function FormActions({ processing, submitLabel, processingLabel = 'Guardando…', cancelHref }: FormActionsProps) {
    return (
        <div className="flex flex-col-reverse gap-3 border-t border-nube pt-6 sm:flex-row sm:justify-end">
            {cancelHref && (
                <Link href={cancelHref} className={cn(adminOutlineButtonClass, 'inline-flex items-center justify-center text-sm')}>
                    Cancelar
                </Link>
            )}
            <button type="submit" disabled={processing} className={cn(adminPrimaryButtonClass, 'w-full sm:w-auto')}>
                {processing ? processingLabel : submitLabel}
            </button>
        </div>
    );
}
