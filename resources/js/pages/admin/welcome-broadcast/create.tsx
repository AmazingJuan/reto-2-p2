import {
    AdminPageHeader,
    adminFieldLabelClass,
    adminFormCardClass,
    adminFormShellNarrowClass,
    adminPrimaryButtonClass,
} from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { useMemo } from 'react';
import { route } from 'ziggy-js';

type CreatePageProps = PageProps<{
    viewData: {
        platform_url: string;
        has_custom_app_url: boolean;
    };
}>;

/** Aproximación rápida del número de correos detectados (el servidor valida de forma definitiva). */
function estimateRecipientCount(raw: string): number {
    const parts = raw.split(/[\r\n,;|]+/);
    const seen = new Set<string>();
    for (const part of parts) {
        let e = part.trim().toLowerCase();
        e = e.replace(/^["'<\s]+|["'>\s]+$/g, '');
        if (!e.includes('@')) {
            continue;
        }
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
            seen.add(e);
        }
    }
    return seen.size;
}

const textareaClass =
    'block w-full rounded-lg border border-slate-200 bg-white px-3 py-3 font-mono text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

export default function Create() {
    const { viewData, flash } = usePage<CreatePageProps & { flash: Record<string, unknown> }>().props;
    const { data, setData, post, processing, errors } = useForm({
        emails_text: '',
    });

    const estimated = useMemo(() => estimateRecipientCount(data.emails_text), [data.emails_text]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.welcome-broadcast.store'));
    };

    return (
        <AdminLayout>
            <Head title="Correos de bienvenida" />

            <div className={cn(adminFormShellNarrowClass, 'pb-8 pt-2 sm:pb-10 sm:pt-0')}>
                <AdminPageHeader
                    icon={Mail}
                    title="Enviar correos de bienvenida"
                    description="Este correo se envía a nuevos clientes para informarles sobre la plataforma donde podrán solicitar cotizaciones."
                />

                <FlashAlert flash={flash} />

                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-800 sm:p-5">
                    <p>
                        <span className="font-semibold text-slate-900">Enlace de la plataforma:</span>{' '}
                        <a href={viewData.platform_url} className="break-all text-[#047ac0] underline hover:text-[#0693e3]">
                            {viewData.platform_url || '—'}
                        </a>
                    </p>
                    {!viewData.has_custom_app_url && (
                        <p className="mt-2 text-slate-600">
                            Se está usando la URL predeterminada de la aplicación. Para usar otra URL pública, configure la{' '}
                            <Link href={route('dashboard.configurations.edit')} className="font-semibold text-[#047ac0] underline hover:text-[#0693e3]">
                                URL de la aplicación
                            </Link>
                            .
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className={adminFormCardClass}>
                    <div className="space-y-4 p-4 sm:p-6 md:p-8">
                        <div>
                            <label htmlFor="emails_text" className={adminFieldLabelClass}>
                                Lista de correos
                            </label>
                            <p id="emails_text-hint" className="mb-2 text-sm text-slate-600">
                                Una dirección por línea, o varias separadas por coma, punto y coma o barra vertical. Puede pegar
                                el contenido directamente desde una hoja de cálculo.
                            </p>
                            <textarea
                                id="emails_text"
                                name="emails_text"
                                value={data.emails_text}
                                onChange={(e) => setData('emails_text', e.target.value)}
                                rows={14}
                                autoComplete="off"
                                autoFocus
                                spellCheck={false}
                                aria-describedby="emails_text-hint emails_text-count"
                                aria-invalid={errors.emails_text ? 'true' : 'false'}
                                aria-errormessage={errors.emails_text ? 'emails_text-error' : undefined}
                                className={textareaClass}
                                placeholder={'cliente1@empresa.com\ncliente2@empresa.com\notro@dominio.org'}
                            />
                            <p id="emails_text-count" className="mt-2 text-sm text-slate-600" aria-live="polite">
                                {data.emails_text.trim() === ''
                                    ? 'Aún no hay texto.'
                                    : estimated === 0
                                      ? 'No se detectaron correos con un formato claro; aun así puede enviar el formulario y el servidor validará las direcciones.'
                                      : estimated === 1
                                        ? 'Aproximadamente 1 correo único detectado.'
                                        : `Aproximadamente ${estimated} correos únicos detectados.`}
                            </p>
                            {errors.emails_text && (
                                <p id="emails_text-error" className="mt-2 text-sm text-red-600" role="alert">
                                    {errors.emails_text}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-slate-500">Máximo 500 correos por envío. Las direcciones duplicadas se envían una sola vez.</p>
                            <Button
                                type="submit"
                                disabled={processing}
                                size="sm"
                                className={cn(adminPrimaryButtonClass, 'w-full sm:w-auto')}
                            >
                                {processing ? 'Enviando…' : 'Poner en cola el envío'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
