import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { BackLink } from '@/components/admin/back-link';
import { adminFormShellClass } from '@/components/admin/styles';
import { GestionLineForm } from '@/features/catalog/gestion-line-form';
import type { GestionLineOption } from '@/features/catalog/types';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export default function Edit() {
    const { gestionLine } = usePage<PageProps<{ gestionLine: GestionLineOption }>>().props;

    return (
        <AdminLayout title="Editar línea de gestión">
            <div className={adminFormShellClass}>
                <BackLink href={route('dashboard.lines.index')} label="Líneas de gestión" />
                <AdminPageHeader title="Editar línea de gestión" />
                <GestionLineForm gestionLine={gestionLine} />
            </div>
        </AdminLayout>
    );
}
