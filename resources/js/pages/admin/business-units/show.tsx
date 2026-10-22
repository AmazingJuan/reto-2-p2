import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { BackLink } from '@/components/admin/back-link';
import { DataTable } from '@/components/admin/data-table';
import { adminListShellClass, adminOutlineButtonClass, adminTableTdClass } from '@/components/admin/styles';
import { SequenceLabel } from '@/features/catalog/business-unit-form';
import type { BusinessUnit } from '@/features/catalog/types';
import AdminLayout from '@/layouts/admin-layout';
import { capitalize } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

type ShowPageProps = PageProps<{
    viewData: { businessUnit: BusinessUnit; services: { id: number; name: string }[] };
}>;

export default function Show() {
    const { businessUnit, services } = usePage<ShowPageProps>().props.viewData;

    return (
        <AdminLayout title={businessUnit.display_name}>
            <div className={adminListShellClass}>
                <BackLink href={route('dashboard.business-unit.index')} label="Unidades de negocio" />

                <AdminPageHeader
                    title={capitalize(businessUnit.display_name)}
                    description={
                        <>
                            Abreviado <span className="font-display font-bold">{businessUnit.abbreviation}</span> · último código{' '}
                            <SequenceLabel unit={businessUnit} />
                        </>
                    }
                >
                    <Link
                        href={route('dashboard.business-unit.edit', businessUnit.id)}
                        className={cn(adminOutlineButtonClass, 'inline-flex items-center justify-center gap-2 text-sm')}
                    >
                        <Pencil className="h-4 w-4" aria-hidden />
                        Editar
                    </Link>
                </AdminPageHeader>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold text-tinta">Servicios ({services.length})</h2>
                    <DataTable
                        columns={[{ label: 'ID' }, { label: 'Nombre' }]}
                        minWidth="20rem"
                        isEmpty={services.length === 0}
                        emptyMessage="Esta unidad no tiene servicios asociados."
                    >
                        {services.map((service) => (
                            <tr key={service.id} className="hover:bg-nube/70">
                                <td className={cn(adminTableTdClass, 'w-20 tabular-nums text-pizarra')}>{service.id}</td>
                                <td className={adminTableTdClass}>
                                    <Link href={route('dashboard.services.edit', service.id)} className="hover:text-azul-hondo hover:underline">
                                        {service.name}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </DataTable>
                </section>
            </div>
        </AdminLayout>
    );
}
