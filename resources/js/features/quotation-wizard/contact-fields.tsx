import { corporate } from '@/components/public/links';
import { cn } from '@/lib/utils';
import type { ContactData } from './types';

export type ContactErrors = Partial<Record<keyof ContactData | 'privacy_accepted', string>>;

type ContactFieldsProps = {
    data: ContactData;
    privacyAccepted: boolean;
    errors: ContactErrors;
    onChange: (field: keyof ContactData, value: string) => void;
    onPrivacyChange: (accepted: boolean) => void;
};

const FIELDS: { key: keyof ContactData; label: string; type: string; autoComplete: string; required: boolean; wide?: boolean }[] = [
    { key: 'name', label: 'Nombre', type: 'text', autoComplete: 'name', required: true, wide: true },
    { key: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email', required: true },
    { key: 'phone', label: 'Teléfono', type: 'tel', autoComplete: 'tel', required: true },
    { key: 'company', label: 'Organización', type: 'text', autoComplete: 'organization', required: false },
    { key: 'role', label: 'Cargo', type: 'text', autoComplete: 'organization-title', required: false },
];

/** Contact block, built like the corporate site's contact form. */
export function ContactFields({ data, privacyAccepted, errors, onChange, onPrivacyChange }: ContactFieldsProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
                {FIELDS.map((field) => {
                    const id = `contact-${field.key}`;
                    const error = errors[field.key];
                    return (
                        <div key={field.key} className={field.wide ? 'sm:col-span-2' : undefined}>
                            <label htmlFor={id} className="label">
                                {field.label} {!field.required && <span className="label-optional">(opcional)</span>}
                            </label>
                            <input
                                id={id}
                                type={field.type}
                                autoComplete={field.autoComplete}
                                required={field.required}
                                value={data[field.key]}
                                onChange={(e) => onChange(field.key, e.target.value)}
                                aria-invalid={error ? true : undefined}
                                aria-describedby={error ? `${id}-error` : undefined}
                                className="control"
                            />
                            {error && (
                                <p id={`${id}-error`} className="field-error mt-2">
                                    {error}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            <div>
                <label className="flex cursor-pointer items-start gap-3 text-base">
                    <input
                        type="checkbox"
                        checked={privacyAccepted}
                        onChange={(e) => onPrivacyChange(e.target.checked)}
                        aria-invalid={errors.privacy_accepted ? true : undefined}
                        aria-describedby={errors.privacy_accepted ? 'privacy-error' : undefined}
                        className={cn(
                            'mt-1 h-5 w-5 shrink-0 rounded border-2 border-gris-marca text-azul focus:ring-0 focus:ring-offset-0',
                            errors.privacy_accepted && 'border-error',
                        )}
                    />
                    <span>
                        Autorizo el tratamiento de mis datos para responder esta solicitud, según la{' '}
                        <a href={corporate.privacy} target="_blank" rel="noopener noreferrer" className="link">
                            política de protección de datos
                        </a>
                        .
                    </span>
                </label>
                {errors.privacy_accepted && (
                    <p id="privacy-error" className="field-error mt-2 pl-8">
                        {errors.privacy_accepted}
                    </p>
                )}
            </div>
        </div>
    );
}

/** Same rules as the server, to fail fast without a round trip. */
export function validateContact(data: ContactData, privacyAccepted: boolean): ContactErrors {
    const errors: ContactErrors = {};
    if (!data.name.trim()) errors.name = 'Escriba su nombre.';
    if (!data.email.trim()) errors.email = 'Escriba su correo electrónico.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Revise el correo; debe tener la forma nombre@empresa.com.';
    if (!data.phone.trim()) errors.phone = 'Escriba un teléfono de contacto.';
    else if (!/^[0-9+\s().-]{7,30}$/.test(data.phone.trim())) errors.phone = 'Use solo números, espacios y los signos + ( ) - .';
    if (!privacyAccepted) errors.privacy_accepted = 'Debe autorizar el tratamiento de sus datos para enviar la solicitud.';
    return errors;
}
