import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { AdminTableToolbar } from '@/components/admin/admin-table-toolbar';
import { DataTable } from '@/components/admin/data-table';
import { DeleteAction, EditAction, RowActions, ViewAction } from '@/components/admin/row-actions';
import { adminListShellClass, adminPrimaryButtonClass, adminTableTdClass } from '@/components/admin/styles';
import type { Professional } from '@/features/professionals/types';
import { useListFilters } from '@/hooks/use-list-filters';
import AdminLayout from '@/layouts/admin-layout';
import { capitalize, pluralize } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { PageProps, Paginated, SearchFilters } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';

type IndexPageProps = PageProps<{
    viewData: { professionals: Paginated<Professional>; filters: SearchFilters };
}>;

export default function Index() {
    const { professionals, filters } = usePage<IndexPageProps>().props.viewData;
    const visit = useListFilters('dashboard.professionals.index', filters);

    return (
        <AdminLayout title="Profesionales">
            <div className={adminListShellClass}>
                <AdminPageHeader
                    title="Profesionales"
                    description="El cliente puede elegir un profesional por línea de gestión; solo ve su ID y experiencia."
                >
                    <Link
                        href={route('dashboard.professionals.create')}
                        className={cn(adminPrimaryButtonClass, 'inline-flex items-center justify-center gap-2 text-sm')}
                    >
                        <Plus className="h-4 w-4" aria-hidden />
                        Nuevo profesional
                    </Link>
                </AdminPageHeader>

                <AdminTableToolbar search={filters.search} onSearch={(search) => visit({ search })} searchPlaceholder="Nombre, resumen o ID…" />

                <DataTable
                    columns={[
                        { label: 'ID' },
                        { label: 'Nombre' },
                        { label: 'Experiencia' },
                        { label: 'Líneas', className: 'hidden md:table-cell' },
                        { label: 'Acciones', align: 'center' },
                    ]}
                    isEmpty={professionals.data.length === 0}
                    emptyMessage={
                        filters.search
                            ? 'No hay resultados para tu búsqueda.'
                            : 'No hay profesionales. Cree el primero para ofrecerlo en el cotizador.'
                    }
                >
                    {professionals.data.map((professional) => (
                        <tr key={professional.id} className="hover:bg-nube/70">
                            <td className={cn(adminTableTdClass, 'w-20 tabular-nums text-pizarra')}>{professional.id}</td>
                            <td className={cn(adminTableTdClass, 'font-medium text-tinta')}>{professional.name}</td>
                            <td className={cn(adminTableTdClass, 'whitespace-nowrap')}>{pluralize(professional.years_experience, 'año', 'años')}</td>
                            <td className={cn(adminTableTdClass, 'hidden max-w-xs text-pizarra md:table-cell')}>
                                {professional.gestion_lines.map((line) => capitalize(line.name ?? '')).join(', ') || '—'}
                            </td>
                            <td className={cn(adminTableTdClass, 'w-40')}>
                                <RowActions>
                                    <ViewAction href={route('dashboard.professionals.show', professional.id)} />
                                    <EditAction href={route('dashboard.professionals.edit', professional.id)} />
                                    <DeleteAction
                                        href={route('dashboard.professionals.delete', professional.id)}
                                        confirmMessage={`¿Eliminar a ${professional.name}? Sus cotizaciones quedarán sin profesional asignado.`}
                                    />
                                </RowActions>
                            </td>
                        </tr>
                    ))}
                </DataTable>

                <AdminPagination meta={professionals} onPageChange={(page) => visit({ page })} />
            </div>
        </AdminLayout>
    );
}
