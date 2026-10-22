import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { FormActions, FormCard, FormField } from '@/components/admin/form';
import { adminFieldInputClass, adminFormShellClass, adminSectionTitleClass } from '@/components/admin/styles';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';

type Configuration = {
    notification_email: string | null;
    company_contact_email: string | null;
    company_contact_phone: string | null;
    company_contact_address: string | null;
    company_website_url: string | null;
    company_website_label: string | null;
};

type FieldKey = keyof Configuration;

const blankToEmpty = (config: Configuration) =>
    Object.fromEntries(Object.entries(config).map(([key, value]) => [key, value ?? ''])) as Record<FieldKey, string>;

export default function Edit() {
    const { configuration } = usePage<PageProps<{ viewData: { configuration: Configuration } }>>().props.viewData;
    const { data, setData, put, processing, errors } = useForm(blankToEmpty(configuration));

    const field = (key: FieldKey, type = 'text') => (
        <input type={type} value={data[key]} onChange={(e) => setData(key, e.target.value)} className={adminFieldInputClass} />
    );

    return (
        <AdminLayout title="Configuración">
            <div className={adminFormShellClass}>
                <AdminPageHeader
                    title="Configuración"
                    description="Destinatario de las notificaciones y datos de contacto que aparecen en los correos al cliente."
                />

                <FormCard onSubmit={() => put(route('dashboard.configurations.update'))}>
                    <section>
                        <h2 className={adminSectionTitleClass}>Notificaciones</h2>
                        <FormField
                            id="notification_email"
                            label="Correo de notificaciones"
                            error={errors.notification_email}
                            hint="Recibe un aviso con cada nueva solicitud y cada propuesta enviada. Déjelo vacío para desactivarlo."
                        >
                            {field('notification_email', 'email')}
                        </FormField>
                    </section>

                    <section>
                        <h2 className={adminSectionTitleClass}>Datos de contacto (pie de los correos)</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField id="company_contact_email" label="Correo de contacto" error={errors.company_contact_email}>
                                {field('company_contact_email', 'email')}
                            </FormField>
                            <FormField id="company_contact_phone" label="Teléfono" error={errors.company_contact_phone}>
                                {field('company_contact_phone', 'tel')}
                            </FormField>
                            <FormField id="company_website_url" label="URL del sitio web" error={errors.company_website_url}>
                                {field('company_website_url', 'url')}
                            </FormField>
                            <FormField id="company_website_label" label="Texto del enlace" error={errors.company_website_label}>
                                {field('company_website_label')}
                            </FormField>
                            <FormField
                                id="company_contact_address"
                                label="Dirección"
                                error={errors.company_contact_address}
                                className="md:col-span-2"
                            >
                                <textarea
                                    rows={3}
                                    value={data.company_contact_address}
                                    onChange={(e) => setData('company_contact_address', e.target.value)}
                                    className={adminFieldInputClass}
                                />
                            </FormField>
                        </div>
                    </section>

                    <FormActions processing={processing} submitLabel="Guardar configuración" />
                </FormCard>
            </div>
        </AdminLayout>
    );
}
