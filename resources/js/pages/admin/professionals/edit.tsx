import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { BackLink } from '@/components/admin/back-link';
import { adminFormShellClass } from '@/components/admin/styles';
import type { GestionLineOption } from '@/features/catalog/types';
import { ProfessionalForm } from '@/features/professionals/professional-form';
import type { Professional } from '@/features/professionals/types';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

type EditProps = PageProps<{ viewData: { professional: Professional }; gestionLines: GestionLineOption[] }>;

export default function Edit() {
    const { viewData, gestionLines } = usePage<EditProps>().props;
    const { professional } = viewData;

    return (
        <AdminLayout title="Editar profesional">
            <div className={adminFormShellClass}>
                <BackLink href={route('dashboard.professionals.index')} label="Profesionales" />
                <AdminPageHeader title="Editar profesional" description={`Profesional #${professional.id}`} />
                <ProfessionalForm professional={professional} gestionLines={gestionLines} />
            </div>
        </AdminLayout>
    );
}
