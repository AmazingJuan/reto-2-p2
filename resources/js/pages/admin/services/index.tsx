import { AdminPagination } from '@/components/admin/admin-pagination';
import { AdminTableToolbar } from '@/components/admin/admin-table-toolbar';
import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Wrench } from 'lucide-react';
import { route } from 'ziggy-js';

interface Service {
    id: number;
    name: string;
    business_unit_id: number;
}

interface BusinessUnit {
    id: number | string;
    display_name: string;
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
        services: Paginated<Service>;
        businessUnits: BusinessUnit[];
        filters: {
            search: string;
            business_unit_id: string;
        };
    };
}>;

export default function Index() {
    const { viewData, flash } = usePage<IndexPageProps & { flash: Record<string, unknown> }>().props;
    const { services, businessUnits, filters } = viewData;
    const rows = services.data;
    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    const handleBusinessUnitFilter = (value: string) => {
        const params: Record<string, string | number> = { page: 1 };
        if (filters.search) {
            params.search = filters.search;
        }
        if (value && value !== 'all') {
            params.business_unit_id = value;
        }
        router.get(route('dashboard.services.index'), params, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que deseas borrar este servicio?')) {
            router.delete(route('dashboard.services.delete', id));
        }
    };

    const handleEdit = (id: number) => {
        router.get(route('dashboard.services.edit', id));
    };

    const handleCreate = () => {
        router.get(route('dashboard.services.create'));
    };

    const unitFilterValue = filters.business_unit_id || 'all';

    return (
        <AdminLayout>
            <div className="w-full min-w-0 space-y-4">
                <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Wrench className="h-7 w-7 shrink-0 text-blue-600 sm:h-8 sm:w-8" />
                        <div className="min-w-0 text-left">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Servicios</h1>
                            <p className="mt-1 text-sm text-gray-600">Administra los servicios por unidad de negocio</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleCreate}
                        variant="crear"
                        className="w-full shrink-0 bg-amber-600 hover:bg-amber-600 sm:w-auto"
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo servicio
                    </Button>
                </div>

                <div className="mx-auto w-full min-w-0 max-w-6xl">
                    <FlashAlert flash={flash} />
                </div>

                <AdminTableToolbar
                    routeName="dashboard.services.index"
                    filters={filters}
                    searchPlaceholder="Nombre del servicio…"
                    extraKeys={['business_unit_id']}
                >
                    <div className="flex w-full min-w-0 flex-col gap-1 sm:w-auto sm:min-w-[200px] md:min-w-[220px]">
                        <label htmlFor="business-unit-filter" className="text-xs font-medium text-gray-600">
                            Unidad de negocio
                        </label>
                        <select
                            id="business-unit-filter"
                            value={unitFilterValue}
                            onChange={(e) => handleBusinessUnitFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todas</option>
                            {businessUnits.map((unit) => (
                                <option key={String(unit.id)} value={String(unit.id)}>
                                    {unit.display_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </AdminTableToolbar>

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
                                rows.map((service) => (
                                    <tr key={service.id} className="transition hover:bg-gray-50">
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{service.id}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{capitalize(service.name)}</td>
                                        <td className="px-3 py-3 text-center sm:px-6 sm:py-4">
                                            <div className="flex justify-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(service.id)}
                                                    className="text-blue-600 transition hover:text-blue-800"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-5 w-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(service.id)}
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
                                        {filters.search || unitFilterValue !== 'all'
                                            ? 'No hay resultados con los filtros actuales.'
                                            : 'No hay servicios registrados.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <AdminPagination
                    routeName="dashboard.services.index"
                    meta={services}
                    filters={filters}
                    extraKeys={['business_unit_id']}
                />
            </div>
        </AdminLayout>
    );
}
