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
            <div className={adminListShellClass}>
                <AdminPageHeader
                    icon={UserCircle}
                    title="Profesionales"
                    description="Asocie líneas de gestión para que el profesional aparezca solo en esas cotizaciones. En público solo se muestra ID y experiencia."
                >
                    <Button
                        type="button"
                        onClick={() => router.get(route('dashboard.professionals.create'))}
                        size="sm"
                        className={cn(adminPrimaryButtonClass, 'w-full sm:w-auto')}
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo profesional
                    </Button>
                </AdminPageHeader>

                <FlashAlert flash={flash} />

                <AdminTableToolbar routeName="dashboard.professionals.index" filters={filters} searchPlaceholder="Nombre, resumen o ID…" />

                <div className={adminTableCardClass}>
                    <table className="min-w-[520px] w-full divide-y divide-slate-200 sm:min-w-full">
                        <thead className="border-b border-slate-100 bg-slate-50/50">
                            <tr>
                                <th className={adminTableThClass}>ID</th>
                                <th className={adminTableThClass}>Nombre</th>
                                <th className={adminTableThClass}>Años exp.</th>
                                <th className={cn(adminTableThClass, 'hidden md:table-cell')}>Líneas</th>
                                <th className={adminTableThCenterClass}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {rows.length > 0 ? (
                                rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50/60">
                                        <td className={adminTableTdClass}>{row.id}</td>
                                        <td className={cn(adminTableTdClass, 'font-medium')}>{row.name}</td>
                                        <td className={adminTableTdClass}>{row.years_experience}</td>
                                        <td className={cn(adminTableTdClass, 'hidden max-w-[14rem] text-xs text-slate-700 md:table-cell')}>
                                            {row.gestion_lines?.length
                                                ? row.gestion_lines.map((l) => l.name).join(', ')
                                                : '—'}
                                        </td>
                                        <td className={cn(adminTableTdClass, 'text-center')}>
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
                                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
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
