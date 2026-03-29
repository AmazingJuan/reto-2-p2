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
            <div className="p-6">
                <div className="mx-auto mb-6 flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-blue-600" />
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-slate-900">Usuarios</h1>
                            <p className="mt-1 text-sm text-gray-600">Gestiona los usuarios del sistema</p>
                        </div>
                    </div>
                    <Button onClick={handleCreate} variant="crear" className="bg-amber-600 hover:bg-amber-600">
                        <Plus className="h-4 w-4" />
                        Nuevo usuario
                    </Button>
                </div>

                <div className="mx-auto max-w-6xl">
                    <FlashAlert flash={flash} />
                </div>

                <AdminTableToolbar
                    routeName="dashboard.users.index"
                    filters={filters}
                    searchPlaceholder="Nombre, correo, teléfono o ID…"
                />

                <div className="mx-auto max-w-6xl overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Correo</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Teléfono</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {rows.length > 0 ? (
                                rows.map((user) => (
                                    <tr key={user.id} className="transition hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.phone ?? '—'}</td>
                                        <td className="px-6 py-4 text-center">
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
                                    <td colSpan={5} className="px-6 py-6 text-center text-gray-500">
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
