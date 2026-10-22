import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { BackLink } from '@/components/admin/back-link';
import { adminFormShellClass } from '@/components/admin/styles';
import { ServiceForm, type ServiceFormProps } from '@/features/catalog/service-form';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export default function Edit() {
    const { service, businessUnits, gestionLines } = usePage<PageProps<Required<ServiceFormProps>>>().props;

    return (
        <AdminLayout title="Editar servicio">
            <div className={adminFormShellClass}>
                <BackLink href={route('dashboard.services.index')} label="Servicios" />
                <AdminPageHeader title="Editar servicio" />
                <ServiceForm service={service} businessUnits={businessUnits} gestionLines={gestionLines} />
            </div>
        </AdminLayout>
    );
}
