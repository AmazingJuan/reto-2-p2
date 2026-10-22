import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { BackLink } from '@/components/admin/back-link';
import { adminFormShellClass } from '@/components/admin/styles';
import { BusinessUnitForm } from '@/features/catalog/business-unit-form';
import type { BusinessUnit } from '@/features/catalog/types';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export default function Edit() {
    const { businessUnit } = usePage<PageProps<{ viewData: { businessUnit: BusinessUnit } }>>().props.viewData;

    return (
        <AdminLayout title="Editar unidad de negocio">
            <div className={adminFormShellClass}>
                <BackLink href={route('dashboard.business-unit.index')} label="Unidades de negocio" />
                <AdminPageHeader title="Editar unidad de negocio" description={businessUnit.display_name} />
                <BusinessUnitForm businessUnit={businessUnit} />
            </div>
        </AdminLayout>
    );
}
