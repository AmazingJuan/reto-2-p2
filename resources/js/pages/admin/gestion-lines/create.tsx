import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { BackLink } from '@/components/admin/back-link';
import { adminFormShellClass } from '@/components/admin/styles';
import { GestionLineForm } from '@/features/catalog/gestion-line-form';
import AdminLayout from '@/layouts/admin-layout';

export default function Create() {
    return (
        <AdminLayout title="Crear línea de gestión">
            <div className={adminFormShellClass}>
                <BackLink href={route('dashboard.lines.index')} label="Líneas de gestión" />
                <AdminPageHeader title="Crear línea de gestión" />
                <GestionLineForm />
            </div>
        </AdminLayout>
    );
}
