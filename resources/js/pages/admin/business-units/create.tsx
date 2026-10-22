import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { BackLink } from '@/components/admin/back-link';
import { adminFormShellClass } from '@/components/admin/styles';
import { BusinessUnitForm } from '@/features/catalog/business-unit-form';
import AdminLayout from '@/layouts/admin-layout';

export default function Create() {
    return (
        <AdminLayout title="Crear unidad de negocio">
            <div className={adminFormShellClass}>
                <BackLink href={route('dashboard.business-unit.index')} label="Unidades de negocio" />
                <AdminPageHeader title="Crear unidad de negocio" />
                <BusinessUnitForm />
            </div>
        </AdminLayout>
    );
}
