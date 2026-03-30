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
import { BriefcaseBusiness, Pencil, Plus, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';

interface BusinessUnit {
    id: number;
    display_name: string;
    abbreviation: string;
    quotation_seq_year?: number | null;
    quotation_seq_value?: number | null;
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
        businessUnits: Paginated<BusinessUnit>;
        filters: {
            search: string;
        };
    };
}>;

export default function Index() {
    const { viewData, flash } = usePage<IndexPageProps & { flash: Record<string, unknown> }>().props;
    const { businessUnits, filters } = viewData;
    const rows = businessUnits.data;
    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que deseas borrar esta unidad de negocio?')) {
            router.delete(route('dashboard.business-unit.delete', id));
        }
    };

    const handleEdit = (id: number) => {
        router.get(route('dashboard.business-unit.edit', id));
    };

    const handleCreate = () => {
        router.get(route('dashboard.business-unit.create'));
    };

    return (
        <AdminLayout>
            <div className={adminListShellClass}>
                <AdminPageHeader
                    icon={BriefcaseBusiness}
                    title="Unidades de negocio"
                    description="Administra las unidades de negocio del sistema"
                >
                    <Button type="button" onClick={handleCreate} size="sm" className={cn(adminPrimaryButtonClass, 'w-full sm:w-auto')}>
                        <Plus className="h-4 w-4" />
                        Nueva unidad
                    </Button>
                </AdminPageHeader>

                <FlashAlert flash={flash} />

                <AdminTableToolbar
                    routeName="dashboard.business-unit.index"
                    filters={filters}
                    searchPlaceholder="Nombre, abreviado o ID…"
                />

                <div className={adminTableCardClass}>
                    <table className="min-w-[520px] w-full divide-y divide-slate-200 sm:min-w-full">
                        <thead className="border-b border-slate-100 bg-slate-50/50">
                            <tr>
                                <th className={adminTableThClass}>ID</th>
                                <th className={adminTableThClass}>Nombre</th>
                                <th className={adminTableThClass}>Abrev.</th>
                                <th className={adminTableThClass}>Cotiz. año</th>
                                <th className={adminTableThCenterClass}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {rows.length > 0 ? (
                                rows.map((unit) => (
                                    <tr
                                        key={unit.id}
                                        className="cursor-pointer transition hover:bg-slate-50/80"
                                        onClick={() => router.get(route('dashboard.business-unit.show', unit.id))}
                                    >
                                        <td className={adminTableTdClass}>{unit.id}</td>
                                        <td className={`${adminTableTdClass} font-medium`}>{capitalize(unit.display_name)}</td>
                                        <td className={`${adminTableTdClass} font-mono text-sm`}>{unit.abbreviation}</td>
                                        <td className={`${adminTableTdClass} text-sm text-slate-600`}>
                                            {unit.quotation_seq_year != null && unit.quotation_seq_year !== undefined
                                                ? `’${String(unit.quotation_seq_year).padStart(2, '0')} → #${unit.quotation_seq_value ?? 0}`
                                                : '—'}
                                        </td>
                                        <td className={`${adminTableTdClass} text-center`} onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-center gap-1 sm:gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(unit.id)}
                                                    className="rounded-lg p-2 text-[#0693e3] transition hover:bg-blue-50 hover:text-[#047ac0]"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-5 w-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(unit.id)}
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
                                        {filters.search ? 'No hay resultados para tu búsqueda.' : 'No hay unidades de negocio registradas.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <AdminPagination routeName="dashboard.business-unit.index" meta={businessUnits} filters={filters} />
            </div>
        </AdminLayout>
    );
}
