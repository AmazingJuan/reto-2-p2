import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { BackLink } from '@/components/admin/back-link';
import { adminFormShellClass } from '@/components/admin/styles';
import type { GestionLineOption } from '@/features/catalog/types';
import { ProfessionalForm } from '@/features/professionals/professional-form';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export default function Create() {
    const { gestionLines } = usePage<PageProps<{ gestionLines: GestionLineOption[] }>>().props;

    return (
        <AdminLayout title="Crear profesional">
            <div className={adminFormShellClass}>
                <BackLink href={route('dashboard.professionals.index')} label="Profesionales" />
                <AdminPageHeader
                    title="Crear profesional"
                    description="El cliente solo verá «Profesional #ID» y los años de experiencia; nombre y resumen son internos."
                />
                <ProfessionalForm gestionLines={gestionLines} />
            </div>
        </AdminLayout>
    );
}
