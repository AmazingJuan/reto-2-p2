import { AdminPagination } from '@/components/admin/admin-pagination';
import { AdminTableToolbar } from '@/components/admin/admin-table-toolbar';
import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { route } from 'ziggy-js';

interface UserRow {
    id: number;
    name: string;
    email: string;
    phone: string | null;
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
        users: Paginated<UserRow>;
        filters: {
            search: string;
        };
    };
}>;

export default function Index() {
    const { viewData, flash } = usePage<IndexPageProps & { flash: Record<string, unknown> }>().props;
    const { users, filters } = viewData;
    const rows = users.data;

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que deseas eliminar este usuario?')) {
            router.delete(route('dashboard.users.delete', id));
        }
    };

    const handleEdit = (id: number) => {
        router.get(route('dashboard.users.edit', { id }));
    };

    const handleCreate = () => {
        router.get(route('dashboard.users.create'));
    };

    return (
        <AdminLayout>
            <div className="w-full min-w-0 space-y-4">
                <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="h-7 w-7 shrink-0 text-blue-600 sm:h-8 sm:w-8" />
                        <div className="min-w-0 text-left">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Usuarios</h1>
                            <p className="mt-1 text-sm text-gray-600">Gestiona los usuarios del sistema</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleCreate}
                        variant="crear"
                        className="w-full shrink-0 bg-amber-600 hover:bg-amber-600 sm:w-auto"
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo usuario
                    </Button>
                </div>

                <div className="mx-auto w-full min-w-0 max-w-6xl">
                    <FlashAlert flash={flash} />
                </div>

                <AdminTableToolbar
                    routeName="dashboard.users.index"
                    filters={filters}
                    searchPlaceholder="Nombre, correo, teléfono o ID…"
                />

                <div className="mx-auto w-full min-w-0 max-w-6xl overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm [-webkit-overflow-scrolling:touch]">
                    <table className="min-w-[640px] w-full divide-y divide-gray-200 sm:min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">ID</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Nombre</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Correo</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Teléfono</th>
                                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {rows.length > 0 ? (
                                rows.map((user) => (
                                    <tr key={user.id} className="transition hover:bg-gray-50">
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{user.id}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{user.name}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{user.email}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{user.phone ?? '—'}</td>
                                        <td className="px-3 py-3 text-center sm:px-6 sm:py-4">
                                            <div className="flex justify-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(user.id)}
                                                    className="text-blue-600 transition hover:text-blue-800"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-5 w-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(user.id)}
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
                                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500 sm:px-6">
                                        {filters.search ? 'No hay resultados para tu búsqueda.' : 'No hay usuarios registrados.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <AdminPagination routeName="dashboard.users.index" meta={users} filters={filters} />
            </div>
        </AdminLayout>
    );
}
