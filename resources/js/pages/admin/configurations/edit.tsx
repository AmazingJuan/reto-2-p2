import {
    AdminPageHeader,
    adminFieldInputClass,
    adminFieldLabelClass,
    adminFormCardClass,
    adminFormShellClass,
    adminOutlineButtonClass,
    adminPrimaryButtonClass,
} from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Settings } from 'lucide-react';
import { route } from 'ziggy-js';

const FIELD_ORDER = [
    'notification_email',
    'company_contact_email',
    'company_contact_phone',
    'company_contact_address',
    'company_website_url',
    'company_website_label',
] as const;

const FIELD_LABELS: Record<string, string> = {
    notification_email: 'Correo de notificaciones (admin)',
    company_contact_email: 'Correo de contacto (pie de correos)',
    company_contact_phone: 'Teléfono de contacto',
    company_contact_address: 'Dirección',
    company_website_url: 'URL del sitio web',
    company_website_label: 'Texto visible del enlace web',
};

function fieldLabel(key: string): string {
    return FIELD_LABELS[key] ?? key.replace(/_/g, ' ');
}

function inputType(key: string): string {
    if (key === 'notification_email' || key === 'company_contact_email') {
        return 'email';
    }
    if (key.endsWith('_url') || key.includes('url')) {
        return 'url';
    }
    return 'text';
}

type EditPageProps = PageProps<{
    viewData: {
        configuration: Record<string, string | null>;
    };
}>;

export default function Edit() {
    const { viewData, flash } = usePage<EditPageProps & { flash: Record<string, unknown> }>().props;
    const configuration = viewData.configuration ?? {};

    const initialData = Object.fromEntries(
        Object.entries(configuration).map(([key, value]) => [key, value ?? '']),
    ) as Record<string, string>;

    const { data, setData, put, processing, errors } = useForm(initialData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('dashboard.configurations.update'));
    };

    const orderSet = new Set<string>([...FIELD_ORDER]);
    const orderedKeys = FIELD_ORDER.filter((k) => k in configuration);
    const extraKeys = Object.keys(configuration).filter((k) => !orderSet.has(k));
    const entries = [...orderedKeys.map((k) => [k, configuration[k]] as const), ...extraKeys.map((k) => [k, configuration[k]] as const)];

    const textareaClass =
        'block min-h-[120px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

    return (
        <AdminLayout>
            <Head title="Configuración" />

            <div className={adminFormShellClass}>
                <AdminPageHeader
                    icon={Settings}
                    title="Configuración"
                    description="Correo de notificaciones y datos de contacto que aparecen en los correos al cliente."
                />

                <FlashAlert flash={flash} />

                <div className={adminFormCardClass}>
                    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:space-y-8 sm:p-8">
                        <div>
                            <div className="grid grid-cols-1 gap-6">
                                {entries.map(([key]) => (
                                    <div key={key}>
                                        <label htmlFor={key} className={adminFieldLabelClass}>
                                            {fieldLabel(key)}
                                        </label>
                                        {key === 'company_contact_address' ? (
                                            <textarea
                                                id={key}
                                                rows={4}
                                                value={data[key] ?? ''}
                                                onChange={(e) => setData(key, e.target.value)}
                                                className={textareaClass}
                                                autoComplete="off"
                                            />
                                        ) : (
                                            <input
                                                id={key}
                                                type={inputType(key)}
                                                value={data[key] ?? ''}
                                                onChange={(e) => setData(key, e.target.value)}
                                                className={adminFieldInputClass}
                                                autoComplete="off"
                                            />
                                        )}
                                        {errors[key] && <p className="mt-2 text-sm text-red-600">{errors[key]}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end sm:pt-6">
                            <Button
                                type="button"
                                onClick={() => window.history.back()}
                                variant="outline"
                                className={cn(adminOutlineButtonClass, 'w-full sm:w-auto')}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                size="sm"
                                className={cn(adminPrimaryButtonClass, 'w-full sm:w-auto')}
                            >
                                {processing ? 'Guardando...' : 'Guardar configuración'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
