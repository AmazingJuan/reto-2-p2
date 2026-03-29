import { AdminPagination } from '@/components/admin/admin-pagination';
import { AdminTableToolbar } from '@/components/admin/admin-table-toolbar';
import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
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
            <div className="w-full min-w-0 space-y-4">
                <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <GitBranch className="h-7 w-7 shrink-0 text-blue-600 sm:h-8 sm:w-8" />
                        <div className="min-w-0 text-left">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Líneas de gestión</h1>
                            <p className="mt-1 text-sm text-gray-600">Administra las líneas de gestión del sistema</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleCreate}
                        variant="crear"
                        className="w-full shrink-0 bg-amber-600 hover:bg-amber-600 sm:w-auto"
                    >
                        <Plus className="h-4 w-4" />
                        Nueva línea
                    </Button>
                </div>

                <div className="mx-auto w-full min-w-0 max-w-6xl">
                    <FlashAlert flash={flash} />
                </div>

                <AdminTableToolbar
                    routeName="dashboard.lines.index"
                    filters={filters}
                    searchPlaceholder="Nombre o ID…"
                />

                <div className="mx-auto w-full min-w-0 max-w-6xl overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm [-webkit-overflow-scrolling:touch]">
                    <table className="min-w-[520px] w-full divide-y divide-gray-200 sm:min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">ID</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Nombre</th>
                                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {rows.length > 0 ? (
                                rows.map((line) => (
                                    <tr key={line.id} className="transition hover:bg-gray-50">
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{line.id}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{capitalize(line.name)}</td>
                                        <td className="px-3 py-3 text-center sm:px-6 sm:py-4">
                                            <div className="flex justify-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(line.id)}
                                                    className="text-blue-600 transition hover:text-blue-800"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-5 w-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(line.id)}
                                                    className="text-red-600 transition hover:text-red-800"
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
                                    <td colSpan={3} className="px-4 py-6 text-center text-gray-500 sm:px-6">
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
