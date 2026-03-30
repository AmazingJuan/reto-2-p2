import { AdminPagination } from '@/components/admin/admin-pagination';
import {
    AdminPageHeader,
    adminListShellClass,
    adminPrimaryButtonClass,
    adminTableCardClass,
    adminTableTdClass,
    adminTableThCenterClass,
    adminTableThClass,
} from '@/components/admin/admin-page-header';
import { AdminTableToolbar } from '@/components/admin/admin-table-toolbar';
import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
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
            <div className={adminListShellClass}>
                <AdminPageHeader icon={Users} title="Usuarios" description="Gestiona los usuarios del sistema">
                    <Button type="button" onClick={handleCreate} size="sm" className={cn(adminPrimaryButtonClass, 'w-full sm:w-auto')}>
                        <Plus className="h-4 w-4" />
                        Nuevo usuario
                    </Button>
                </AdminPageHeader>

                <FlashAlert flash={flash} />

                <AdminTableToolbar
                    routeName="dashboard.users.index"
                    filters={filters}
                    searchPlaceholder="Nombre, correo, teléfono o ID…"
                />

                <div className={adminTableCardClass}>
                    <table className="min-w-[640px] w-full divide-y divide-slate-200 sm:min-w-full">
                        <thead className="border-b border-slate-100 bg-slate-50/50">
                            <tr>
                                <th className={adminTableThClass}>ID</th>
                                <th className={adminTableThClass}>Nombre</th>
                                <th className={adminTableThClass}>Correo</th>
                                <th className={adminTableThClass}>Teléfono</th>
                                <th className={adminTableThCenterClass}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {rows.length > 0 ? (
                                rows.map((user) => (
                                    <tr key={user.id} className="transition hover:bg-slate-50/80">
                                        <td className={adminTableTdClass}>{user.id}</td>
                                        <td className={adminTableTdClass}>{user.name}</td>
                                        <td className={adminTableTdClass}>{user.email}</td>
                                        <td className={adminTableTdClass}>{user.phone ?? '—'}</td>
                                        <td className={`${adminTableTdClass} text-center`}>
                                            <div className="flex justify-center gap-1 sm:gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(user.id)}
                                                    className="rounded-lg p-2 text-[#0693e3] transition hover:bg-blue-50 hover:text-[#047ac0]"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-5 w-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(user.id)}
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
                                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
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
