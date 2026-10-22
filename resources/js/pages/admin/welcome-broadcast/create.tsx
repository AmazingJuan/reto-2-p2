import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { FormCard, FormField } from '@/components/admin/form';
import { adminFieldInputClass, adminFormShellClass, adminPrimaryButtonClass } from '@/components/admin/styles';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useMemo } from 'react';

const MAX_RECIPIENTS = 500;

/** Rough client-side count of unique addresses; the server validates for real. */
function countEmails(raw: string): number {
    const unique = new Set(
        raw
            .split(/[\r\n,;|]+/)
            .map((part) =>
                part
                    .trim()
                    .toLowerCase()
                    .replace(/^["'<\s]+|["'>\s]+$/g, ''),
            )
            .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
    );
    return unique.size;
}

export default function Create() {
    const { app_url } = usePage<PageProps<{ viewData: { app_url: string } }>>().props.viewData;
    const { data, setData, post, processing, errors, reset } = useForm({ emails_text: '' });
    const detected = useMemo(() => countEmails(data.emails_text), [data.emails_text]);

    // Clearing on success avoids accidentally re-sending the same list.
    const submit = () => post(route('dashboard.welcome-broadcast.store'), { onSuccess: () => reset() });

    return (
        <AdminLayout title="Correos de bienvenida">
            <div className={adminFormShellClass}>
                <AdminPageHeader
                    title="Correos de bienvenida"
                    description={
                        <>
                            Invita a clientes a la plataforma. El botón del correo enlaza a{' '}
                            <a href={app_url} className="font-medium text-azul-hondo underline underline-offset-2">
                                {app_url}
                            </a>{' '}
                            (variable APP_URL).
                        </>
                    }
                />

                <FormCard onSubmit={submit}>
                    <FormField
                        id="emails_text"
                        label="Lista de correos"
                        error={errors.emails_text}
                        hint="Una dirección por línea o separadas por coma, punto y coma o barra vertical. Puede pegar directamente desde una hoja de cálculo."
                    >
                        <textarea
                            value={data.emails_text}
                            onChange={(e) => setData('emails_text', e.target.value)}
                            rows={12}
                            autoComplete="off"
                            spellCheck={false}
                            className={cn(adminFieldInputClass, 'font-display font-semibold')}
                            placeholder={'cliente1@empresa.com\ncliente2@empresa.com'}
                        />
                    </FormField>

                    <div className="flex flex-col gap-4 border-t border-nube pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-pizarra" aria-live="polite">
                            <span className={cn('font-semibold tabular-nums', detected > MAX_RECIPIENTS ? 'text-error' : 'text-tinta')}>
                                {detected}
                            </span>{' '}
                            {detected === 1 ? 'correo único detectado' : 'correos únicos detectados'} · máximo {MAX_RECIPIENTS} por envío
                        </p>
                        <button
                            type="submit"
                            disabled={processing || data.emails_text.trim() === ''}
                            className={cn(adminPrimaryButtonClass, 'gap-2')}
                        >
                            <Send className="h-4 w-4" aria-hidden />
                            {processing ? 'Enviando…' : 'Poner en cola el envío'}
                        </button>
                    </div>
                </FormCard>
            </div>
        </AdminLayout>
    );
}
