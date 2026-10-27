import { corporate } from '@/components/public/links';
import { cn } from '@/lib/utils';
import type { ContactData } from './types';

export type ContactErrors = Partial<Record<keyof ContactData | 'privacy_accepted', string>>;

type Field = {
    key: keyof ContactData;
    label: string;
    type: string;
    autoComplete: string;
    required: boolean;
    placeholder?: string;
    wide?: boolean;
};

// The client data at the top of the "formato de encuadre", as usual in an audit request.
const FIELDS: Field[] = [
    {
        key: 'company',
        label: 'Razón social',
        type: 'text',
        autoComplete: 'organization',
        required: true,
        placeholder: 'Ej.: Construcciones Andinas S.A.S.',
        wide: true,
    },
    { key: 'nit', label: 'NIT', type: 'text', autoComplete: 'off', required: false, placeholder: 'Ej.: 900123456-7' },
    {
        key: 'economic_activity',
        label: 'Actividad económica',
        type: 'text',
        autoComplete: 'off',
        required: false,
        placeholder: 'Ej.: construcción de obras civiles',
    },
    {
        key: 'address',
        label: 'Dirección',
        type: 'text',
        autoComplete: 'street-address',
        required: false,
        placeholder: 'Ej.: Cra. 50 # 10-20, Medellín',
        wide: true,
    },
    { key: 'name', label: 'Nombre del contacto', type: 'text', autoComplete: 'name', required: true },
    { key: 'role', label: 'Cargo', type: 'text', autoComplete: 'organization-title', required: true, placeholder: 'Ej.: Coordinadora HSEQ' },
    { key: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email', required: true, placeholder: 'nombre@empresa.com' },
    { key: 'phone', label: 'Teléfono', type: 'tel', autoComplete: 'tel', required: true, placeholder: 'Ej.: 300 123 4567' },
];

type ContactFieldsProps = {
    data: ContactData;
    errors: ContactErrors;
    onChange: (field: keyof ContactData, value: string) => void;
};

/** The client data of the encuadre: one set of fields for the company and its contact. */
export function ContactFields({ data, errors, onChange }: ContactFieldsProps) {
    return (
        <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
            {FIELDS.map((field) => {
                const id = `contact-${field.key}`;
                const error = errors[field.key];
                return (
                    <div key={field.key} className={cn('scroll-mt-28', field.wide && 'sm:col-span-2')}>
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
                            placeholder={field.placeholder}
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
    );
}

/** Authorization to process the data, next to the send button. */
export function PrivacyConsent({ accepted, error, onChange }: { accepted: boolean; error?: string; onChange: (accepted: boolean) => void }) {
    return (
        <div id="privacy" className="scroll-mt-28">
            <label className="flex cursor-pointer items-start gap-3 text-base">
                <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => onChange(e.target.checked)}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? 'privacy-error' : undefined}
                    className={cn(
                        'mt-1 h-5 w-5 shrink-0 rounded border-2 border-gris-marca text-azul focus:ring-0 focus:ring-offset-0',
                        error && 'border-error',
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
            {error && (
                <p id="privacy-error" className="field-error mt-2 pl-8">
                    {error}
                </p>
            )}
        </div>
    );
}

/** Same rules as the server, to fail fast without a round trip. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[0-9+\s().-]{7,30}$/;

export function validateContact(data: ContactData, privacyAccepted: boolean): ContactErrors {
    const errors: ContactErrors = {};
    if (!data.company.trim()) errors.company = 'Escriba la razón social de su organización.';
    if (!data.name.trim()) errors.name = 'Escriba su nombre.';
    if (!data.role.trim()) errors.role = 'Escriba su cargo.';
    if (!data.email.trim()) errors.email = 'Escriba su correo electrónico.';
    else if (!EMAIL.test(data.email.trim())) errors.email = 'Revise el correo; debe tener la forma nombre@empresa.com.';
    if (!data.phone.trim()) errors.phone = 'Escriba un teléfono de contacto.';
    else if (!PHONE.test(data.phone.trim())) errors.phone = 'Use solo números, espacios y los signos + ( ) - .';
    if (!privacyAccepted) errors.privacy_accepted = 'Debe autorizar el tratamiento de sus datos para enviar la solicitud.';
    return errors;
}
