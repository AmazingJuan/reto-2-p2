import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { AdminTableToolbar } from '@/components/admin/admin-table-toolbar';
import { DataTable } from '@/components/admin/data-table';
import { DeleteAction, EditAction, RowActions } from '@/components/admin/row-actions';
import { adminListShellClass, adminPrimaryButtonClass, adminTableTdClass } from '@/components/admin/styles';
import type { GestionLineOption } from '@/features/catalog/types';
import { useListFilters } from '@/hooks/use-list-filters';
import AdminLayout from '@/layouts/admin-layout';
import { capitalize } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { PageProps, Paginated, SearchFilters } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';

type IndexPageProps = PageProps<{
    viewData: { gestionLines: Paginated<GestionLineOption>; filters: SearchFilters };
}>;

export default function Index() {
    const { gestionLines, filters } = usePage<IndexPageProps>().props.viewData;
    const visit = useListFilters('dashboard.lines.index', filters);

    return (
        <AdminLayout title="Líneas de gestión">
            <div className={adminListShellClass}>
                <AdminPageHeader title="Líneas de gestión" description="Agrupan los servicios que el cliente elige en el cotizador.">
                    <Link
                        href={route('dashboard.lines.create')}
                        className={cn(adminPrimaryButtonClass, 'inline-flex items-center justify-center gap-2 text-sm')}
                    >
                        <Plus className="h-4 w-4" aria-hidden />
                        Nueva línea
                    </Link>
                </AdminPageHeader>

                <AdminTableToolbar search={filters.search} onSearch={(search) => visit({ search })} searchPlaceholder="Nombre o ID…" />

                <DataTable
                    columns={[{ label: 'ID' }, { label: 'Nombre' }, { label: 'Acciones', align: 'center' }]}
                    minWidth="28rem"
                    isEmpty={gestionLines.data.length === 0}
                    emptyMessage={filters.search ? 'No hay resultados para su búsqueda.' : 'No hay líneas de gestión registradas.'}
                >
                    {gestionLines.data.map((line) => (
                        <tr key={line.id} className="hover:bg-nube/70">
                            <td className={cn(adminTableTdClass, 'w-20 tabular-nums text-pizarra')}>{line.id}</td>
                            <td className={cn(adminTableTdClass, 'font-medium text-tinta')}>{capitalize(line.name)}</td>
                            <td className={cn(adminTableTdClass, 'w-32')}>
                                <RowActions>
                                    <EditAction href={route('dashboard.lines.edit', line.id)} />
                                    <DeleteAction
                                        href={route('dashboard.lines.delete', line.id)}
                                        confirmMessage={`¿Eliminar la línea de gestión «${line.name}»?`}
                                    />
                                </RowActions>
                            </td>
                        </tr>
                    ))}
                </DataTable>

                <AdminPagination meta={gestionLines} onPageChange={(page) => visit({ page })} />
            </div>
        </AdminLayout>
    );
}
