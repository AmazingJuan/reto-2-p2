import {
    AdminPageHeader,
    adminListShellClass,
    adminPrimaryButtonClass,
    adminTableCardClass,
    adminTableTdClass,
    adminTableThCenterClass,
    adminTableThClass,
} from '@/components/admin/admin-page-header';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { AdminTableToolbar } from '@/components/admin/admin-table-toolbar';
import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { GitBranch, Pencil, Plus, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';

interface GestionLine {
    id: number;
    name: string;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

type IndexPageProps = PageProps<{
    viewData: {
        gestionLines: Paginated<GestionLine>;
        filters: {
            search: string;
        };
    };
}>;

export default function Index() {
    const { viewData, flash } = usePage<IndexPageProps & { flash: Record<string, unknown> }>().props;
    const { gestionLines, filters } = viewData;
    const rows = gestionLines.data;
    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que deseas borrar esta línea de gestión?')) {
            router.delete(route('dashboard.lines.delete', id));
        }
    };

    const handleEdit = (id: number) => {
        router.get(route('dashboard.lines.edit', { id }));
    };

    const handleCreate = () => {
        router.get(route('dashboard.lines.create'));
    };

    return (
        <AdminLayout>
            <div className={adminListShellClass}>
                <AdminPageHeader
                    icon={GitBranch}
                    title="Líneas de gestión"
                    description="Administra las líneas de gestión del sistema"
                >
                    <Button type="button" onClick={handleCreate} size="sm" className={cn(adminPrimaryButtonClass, 'w-full sm:w-auto')}>
                        <Plus className="h-4 w-4" />
                        Nueva línea
                    </Button>
                </AdminPageHeader>

                <FlashAlert flash={flash} />

                <AdminTableToolbar
                    routeName="dashboard.lines.index"
                    filters={filters}
                    searchPlaceholder="Nombre o ID…"
                />

                <div className={adminTableCardClass}>
                    <table className="min-w-[520px] w-full divide-y divide-slate-200 sm:min-w-full">
                        <thead className="border-b border-slate-100 bg-slate-50/50">
                            <tr>
                                <th className={adminTableThClass}>ID</th>
                                <th className={adminTableThClass}>Nombre</th>
                                <th className={adminTableThCenterClass}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {rows.length > 0 ? (
                                rows.map((line) => (
                                    <tr key={line.id} className="transition hover:bg-slate-50/80">
                                        <td className={adminTableTdClass}>{line.id}</td>
                                        <td className={adminTableTdClass}>{capitalize(line.name)}</td>
                                        <td className={`${adminTableTdClass} text-center`}>
                                            <div className="flex justify-center gap-1 sm:gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(line.id)}
                                                    className="rounded-lg p-2 text-[#0693e3] transition hover:bg-blue-50 hover:text-[#047ac0]"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-5 w-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(line.id)}
                                                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-700"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
                                        {filters.search ? 'No hay resultados para tu búsqueda.' : 'No hay líneas de gestión registradas.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <AdminPagination routeName="dashboard.lines.index" meta={gestionLines} filters={filters} />
            </div>
        </AdminLayout>
    );
}
