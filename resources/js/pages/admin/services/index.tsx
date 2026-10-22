import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { AdminTableToolbar } from '@/components/admin/admin-table-toolbar';
import { DataTable } from '@/components/admin/data-table';
import { FilterSelect } from '@/components/admin/filter-select';
import { DeleteAction, EditAction, RowActions } from '@/components/admin/row-actions';
import { adminListShellClass, adminPrimaryButtonClass, adminTableTdClass } from '@/components/admin/styles';
import { useListFilters } from '@/hooks/use-list-filters';
import AdminLayout from '@/layouts/admin-layout';
import { capitalize } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { PageProps, Paginated, SearchFilters } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';

type ServiceRow = {
    id: number;
    name: string;
    business_unit: { id: number; display_name: string };
    gestion_line: { id: number; name: string };
};

type IndexPageProps = PageProps<{
    viewData: {
        services: Paginated<ServiceRow>;
        businessUnits: { id: number; display_name: string }[];
        filters: SearchFilters & { business_unit_id: string };
    };
}>;

export default function Index() {
    const { services, businessUnits, filters } = usePage<IndexPageProps>().props.viewData;
    const visit = useListFilters('dashboard.services.index', filters);
    const isFiltered = Boolean(filters.search || filters.business_unit_id);

    return (
        <AdminLayout title="Servicios">
            <div className={adminListShellClass}>
                <AdminPageHeader
                    title="Servicios"
                    description="Servicios que el cliente puede seleccionar, por unidad de negocio y línea de gestión."
                >
                    <Link
                        href={route('dashboard.services.create')}
                        className={cn(adminPrimaryButtonClass, 'inline-flex items-center justify-center gap-2 text-sm')}
                    >
                        <Plus className="h-4 w-4" aria-hidden />
                        Nuevo servicio
                    </Link>
                </AdminPageHeader>

                <AdminTableToolbar search={filters.search} onSearch={(search) => visit({ search })} searchPlaceholder="Nombre del servicio o ID…">
                    <FilterSelect
                        id="business-unit-filter"
                        label="Unidad de negocio"
                        value={filters.business_unit_id}
                        onChange={(business_unit_id) => visit({ business_unit_id })}
                        allLabel="Todas"
                        options={businessUnits.map((unit) => ({ value: String(unit.id), label: unit.display_name }))}
                    />
                </AdminTableToolbar>

                <DataTable
                    columns={[
                        { label: 'ID' },
                        { label: 'Nombre' },
                        { label: 'Unidad de negocio' },
                        { label: 'Línea de gestión' },
                        { label: 'Acciones', align: 'center' },
                    ]}
                    minWidth="44rem"
                    isEmpty={services.data.length === 0}
                    emptyMessage={isFiltered ? 'No hay resultados con los filtros actuales.' : 'No hay servicios registrados.'}
                >
                    {services.data.map((service) => (
                        <tr key={service.id} className="hover:bg-nube/70">
                            <td className={cn(adminTableTdClass, 'w-20 tabular-nums text-pizarra')}>{service.id}</td>
                            <td className={cn(adminTableTdClass, 'font-medium text-tinta')}>{capitalize(service.name)}</td>
                            <td className={adminTableTdClass}>{service.business_unit.display_name}</td>
                            <td className={adminTableTdClass}>{capitalize(service.gestion_line.name)}</td>
                            <td className={cn(adminTableTdClass, 'w-32')}>
                                <RowActions>
                                    <EditAction href={route('dashboard.services.edit', service.id)} />
                                    <DeleteAction
                                        href={route('dashboard.services.delete', service.id)}
                                        confirmMessage={`¿Eliminar el servicio «${service.name}»?`}
                                    />
                                </RowActions>
                            </td>
                        </tr>
                    ))}
                </DataTable>

                <AdminPagination meta={services} onPageChange={(page) => visit({ page })} />
            </div>
        </AdminLayout>
    );
}
