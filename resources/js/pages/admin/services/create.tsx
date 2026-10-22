import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { BackLink } from '@/components/admin/back-link';
import { adminFormShellClass } from '@/components/admin/styles';
import { ServiceForm, type ServiceFormProps } from '@/features/catalog/service-form';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export default function Create() {
    const { businessUnits, gestionLines } = usePage<PageProps<Omit<ServiceFormProps, 'service'>>>().props;

    return (
        <AdminLayout title="Crear servicio">
            <div className={adminFormShellClass}>
                <BackLink href={route('dashboard.services.index')} label="Servicios" />
                <AdminPageHeader title="Crear servicio" description="El servicio aparecerá en el cotizador dentro de su unidad y línea de gestión." />
                <ServiceForm businessUnits={businessUnits} gestionLines={gestionLines} />
            </div>
        </AdminLayout>
    );
}
