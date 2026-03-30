import { AdminPagination } from '@/components/admin/admin-pagination';
import { AdminTableToolbar } from '@/components/admin/admin-table-toolbar';
import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2, UserCircle } from 'lucide-react';
import { route } from 'ziggy-js';

interface ProfessionalRow {
    id: number;
    name: string;
    years_experience: number;
    gestion_lines: { id: number; name: string }[];
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
        professionals: Paginated<ProfessionalRow>;
        filters: { search: string };
    };
}>;

export default function Index() {
    const { viewData, flash } = usePage<IndexPageProps & { flash: Record<string, unknown> }>().props;
    const { professionals, filters } = viewData;
    const rows = professionals.data;

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este profesional? Las cotizaciones asociadas quedarán sin profesional.')) {
            router.delete(route('dashboard.professionals.delete', id));
        }
    };

    return (
        <AdminLayout>
            <div className="w-full min-w-0 space-y-4">
                <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <UserCircle className="h-8 w-8 shrink-0 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Profesionales</h1>
                            <p className="mt-1 text-sm text-slate-600">
                                Asocie líneas de gestión para que el profesional aparezca solo en esas cotizaciones. En público solo se muestra ID y experiencia.
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => router.get(route('dashboard.professionals.create'))}
                        variant="crear"
                        className="w-full bg-amber-600 hover:bg-amber-600 sm:w-auto"
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo profesional
                    </Button>
                </div>

                <div className="mx-auto w-full max-w-6xl">
                    <FlashAlert flash={flash} />
                </div>

                <AdminTableToolbar routeName="dashboard.professionals.index" filters={filters} searchPlaceholder="Nombre, resumen o ID…" />

                <div className="mx-auto w-full max-w-6xl overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm [-webkit-overflow-scrolling:touch]">
                    <table className="min-w-[520px] w-full divide-y divide-gray-200 sm:min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">ID</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Nombre</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Años exp.</th>
                                <th className="hidden px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 md:table-cell sm:px-6 sm:py-3">
                                    Líneas
                                </th>
                                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {rows.length > 0 ? (
                                rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{row.id}</td>
                                        <td className="px-3 py-3 text-sm font-medium text-gray-900 sm:px-6 sm:py-4">{row.name}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{row.years_experience}</td>
                                        <td className="hidden max-w-[14rem] px-3 py-3 text-xs text-gray-700 md:table-cell sm:px-6 sm:py-4">
                                            {row.gestion_lines?.length
                                                ? row.gestion_lines.map((l) => l.name).join(', ')
                                                : '—'}
                                        </td>
                                        <td className="px-3 py-3 text-center sm:px-6 sm:py-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => router.get(route('dashboard.professionals.show', row.id))}
                                                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                                                    title="Ver"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => router.get(route('dashboard.professionals.edit', row.id))}
                                                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-5 w-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(row.id)}
                                                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
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
                                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500 sm:px-6">
                                        {filters.search ? 'Sin resultados.' : 'No hay profesionales. Cree el primero para el cotizador.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <AdminPagination routeName="dashboard.professionals.index" meta={professionals} filters={filters} />
            </div>
        </AdminLayout>
    );
}
