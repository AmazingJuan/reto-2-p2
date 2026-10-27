import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { AdminTableToolbar } from '@/components/admin/admin-table-toolbar';
import { DataTable } from '@/components/admin/data-table';
import { DeleteAction, EditAction, RowActions, ViewAction } from '@/components/admin/row-actions';
import { adminListShellClass, adminPrimaryButtonClass, adminTableTdClass } from '@/components/admin/styles';
import { SequenceLabel } from '@/features/catalog/business-unit-form';
import type { BusinessUnit } from '@/features/catalog/types';
import { useListFilters } from '@/hooks/use-list-filters';
import AdminLayout from '@/layouts/admin-layout';
import { capitalize } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { PageProps, Paginated, SearchFilters } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';

type IndexPageProps = PageProps<{
    viewData: { businessUnits: Paginated<BusinessUnit>; filters: SearchFilters };
}>;

export default function Index() {
    const { businessUnits, filters } = usePage<IndexPageProps>().props.viewData;
    const visit = useListFilters('dashboard.business-unit.index', filters);

    return (
        <AdminLayout title="Unidades de negocio">
            <div className={adminListShellClass}>
                <AdminPageHeader title="Unidades de negocio" description="Primer paso del cotizador. Cada unidad tiene su propio árbol de decisión.">
                    <Link
                        href={route('dashboard.business-unit.create')}
                        className={cn(adminPrimaryButtonClass, 'inline-flex items-center justify-center gap-2 text-sm')}
                    >
                        <Plus className="h-4 w-4" aria-hidden />
                        Nueva unidad
                    </Link>
                </AdminPageHeader>

                <AdminTableToolbar search={filters.search} onSearch={(search) => visit({ search })} searchPlaceholder="Nombre o abreviado…" />

                <DataTable
                    columns={[
                        { label: 'ID' },
                        { label: 'Nombre' },
                        { label: 'Abreviado' },
                        { label: 'Último código' },
                        { label: 'Acciones', align: 'center' },
                    ]}
                    isEmpty={businessUnits.data.length === 0}
                    emptyMessage={filters.search ? 'No hay resultados para su búsqueda.' : 'No hay unidades de negocio registradas.'}
                >
                    {businessUnits.data.map((unit) => (
                        <tr key={unit.id} className="hover:bg-nube/70">
                            <td className={cn(adminTableTdClass, 'w-20 tabular-nums text-pizarra')}>{unit.id}</td>
                            <td className={cn(adminTableTdClass, 'font-medium text-tinta')}>
                                <Link href={route('dashboard.business-unit.show', unit.id)} className="hover:text-azul-hondo hover:underline">
                                    {capitalize(unit.display_name)}
                                </Link>
                            </td>
                            <td className={cn(adminTableTdClass, 'font-display font-semibold')}>{unit.abbreviation}</td>
                            <td className={adminTableTdClass}>
                                <SequenceLabel unit={unit} />
                            </td>
                            <td className={cn(adminTableTdClass, 'w-40')}>
                                <RowActions>
                                    <ViewAction href={route('dashboard.business-unit.show', unit.id)} />
                                    <EditAction href={route('dashboard.business-unit.edit', unit.id)} />
                                    <DeleteAction
                                        href={route('dashboard.business-unit.delete', unit.id)}
                                        confirmMessage={`¿Eliminar la unidad «${unit.display_name}»? También se borrará su árbol de decisión.`}
                                    />
                                </RowActions>
                            </td>
                        </tr>
                    ))}
                </DataTable>

                <AdminPagination meta={businessUnits} onPageChange={(page) => visit({ page })} />
            </div>
        </AdminLayout>
    );
}
