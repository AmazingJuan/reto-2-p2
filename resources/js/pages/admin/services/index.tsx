import {
    AdminPageHeader,
    adminListShellClass,
    adminPrimaryButtonClass,
    adminSelectFieldClass,
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
import { Pencil, Plus, Trash2, Wrench } from 'lucide-react';
import { route } from 'ziggy-js';

interface Service {
    id: number;
    name: string;
    business_unit_id: number;
    gestion_line_id: number;
    business_unit: { id: number; display_name: string };
    gestion_line: { id: number; name: string };
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
            <div className={adminListShellClass}>
                <AdminPageHeader
                    icon={Wrench}
                    title="Servicios"
                    description="Administra los servicios por unidad de negocio"
                >
                    <Button type="button" onClick={handleCreate} size="sm" className={cn(adminPrimaryButtonClass, 'w-full sm:w-auto')}>
                        <Plus className="h-4 w-4" />
                        Nuevo servicio
                    </Button>
                </AdminPageHeader>

                <FlashAlert flash={flash} />

                <AdminTableToolbar
                    routeName="dashboard.services.index"
                    filters={filters}
                    searchPlaceholder="Nombre del servicio…"
                    extraKeys={['business_unit_id']}
                >
                    <div className="flex w-full min-w-0 flex-col gap-1 sm:w-auto sm:min-w-[200px] md:min-w-[220px]">
                        <label htmlFor="business-unit-filter" className="text-xs font-semibold text-slate-600">
                            Unidad de negocio
                        </label>
                        <select
                            id="business-unit-filter"
                            value={unitFilterValue}
                            onChange={(e) => handleBusinessUnitFilter(e.target.value)}
                            className={adminSelectFieldClass}
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

                <div className={adminTableCardClass}>
                    <table className="min-w-[720px] w-full divide-y divide-slate-200 sm:min-w-full">
                        <thead className="border-b border-slate-100 bg-slate-50/50">
                            <tr>
                                <th className={adminTableThClass}>ID</th>
                                <th className={adminTableThClass}>Nombre</th>
                                <th className={adminTableThClass}>Unidad de negocio</th>
                                <th className={adminTableThClass}>Línea de gestión</th>
                                <th className={adminTableThCenterClass}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {rows.length > 0 ? (
                                rows.map((service) => (
                                    <tr key={service.id} className="transition hover:bg-slate-50/80">
                                        <td className={adminTableTdClass}>{service.id}</td>
                                        <td className={adminTableTdClass}>{capitalize(service.name)}</td>
                                        <td className={adminTableTdClass}>{service.business_unit.display_name}</td>
                                        <td className={adminTableTdClass}>{service.gestion_line.name}</td>
                                        <td className={`${adminTableTdClass} text-center`}>
                                            <div className="flex justify-center gap-1 sm:gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(service.id)}
                                                    className="rounded-lg p-2 text-[#0693e3] transition hover:bg-blue-50 hover:text-[#047ac0]"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-5 w-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(service.id)}
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
