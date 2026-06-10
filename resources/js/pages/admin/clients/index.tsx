import {
    AdminPageHeader,
    adminListShellClass,
    adminSelectFieldClass,
    adminTableCardClass,
    adminTableTdClass,
    adminTableThCenterClass,
    adminTableThClass,
} from '@/components/admin/admin-page-header';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { AdminTableToolbar } from '@/components/admin/admin-table-toolbar';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ChevronDown, Contact, Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

interface Client {
    id: number;
    name: string;
    email: string;
    company?: string | null;
    phone?: string | null;
    role?: string | null;
    quotations_count: number;
    generated_count: number;
    pending_count: number;
    last_quotation_at?: string | null;
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

interface Filters {
    search: string;
    company: string;
    business_unit: string;
    [key: string]: string;
}

type IndexPageProps = PageProps<{
    viewData: {
        clients: Paginated<Client>;
        filters: Filters;
        options: {
            companies: string[];
            businessUnits: string[];
        };
    };
}>;

const EXTRA_KEYS = ['company', 'business_unit'];

function formatDate(value?: string | null): string {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('es-CO');
}

export default function Index() {
    const { viewData, flash } = usePage<IndexPageProps & { flash: Record<string, unknown> }>().props;
    const { clients, filters, options } = viewData;
    const rows = clients.data;

    const navigateWithFilters = (overrides: { search?: string; company?: string; business_unit?: string }) => {
        const merged = { ...filters, ...overrides };
        const params: Record<string, string | number> = { page: 1 };
        if (merged.search) params.search = merged.search;
        if (merged.company) params.company = merged.company;
        if (merged.business_unit) params.business_unit = merged.business_unit;
        router.get(route('dashboard.clients.index'), params, { preserveState: true, replace: true });
    };

    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

    const readCookie = (name: string): string => {
        const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
        return match ? decodeURIComponent(match[2]) : '';
    };

    const filenameFromDisposition = (header: string | null): string | null => {
        if (!header) return null;
        const match = header.match(/filename=\"?([^\";]+)\"?/i);

        return match?.[1] ?? null;
    };

    const handleExport = async () => {
        if (exporting) return;
        setExportError(null);
        setExporting(true);

        try {
            const res = await fetch(route('dashboard.clients.export.start'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': readCookie('XSRF-TOKEN'),
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    search: filters.search ?? '',
                    company: filters.company ?? '',
                    business_unit: filters.business_unit ?? '',
                }),
            });

            const contentType = res.headers.get('Content-Type') ?? '';

            if (!res.ok || contentType.includes('application/json')) {
                throw new Error('start failed');
            }

            const blob = await res.blob();
            const filename =
                filenameFromDisposition(res.headers.get('Content-Disposition')) ??
                `clientes_${new Date().toISOString().slice(0, 10)}.xlsx`;

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch {
            setExportError('No se pudo generar el archivo. Intenta nuevamente.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <AdminLayout>
            <Head title="Clientes" />

            <div className={adminListShellClass}>
                <AdminPageHeader
                    icon={Contact}
                    title="Clientes"
                    description="Clientes que han generado cotizaciones y su historial"
                >
                    <button
                        type="button"
                        onClick={handleExport}
                        disabled={exporting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                    >
                        {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        {exporting ? 'Generando…' : 'Exportar a Excel'}
                    </button>
                </AdminPageHeader>

                <FlashAlert flash={flash} />

                {exportError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        {exportError}
                    </div>
                )}

                <AdminTableToolbar
                    routeName="dashboard.clients.index"
                    filters={filters}
                    searchPlaceholder="Nombre, correo, empresa, teléfono…"
                    extraKeys={EXTRA_KEYS}
                >
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                        <div className="relative w-full sm:w-auto">
                            <select
                                value={filters.company}
                                onChange={(e) => navigateWithFilters({ company: e.target.value })}
                                className={`${adminSelectFieldClass} w-full cursor-pointer appearance-none pr-9 sm:w-52`}
                                aria-label="Filtrar por empresa"
                            >
                                <option value="">Todas las empresas</option>
                                {options.companies.map((company) => (
                                    <option key={company} value={company}>
                                        {company}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>

                        <div className="relative w-full sm:w-auto">
                            <select
                                value={filters.business_unit}
                                onChange={(e) => navigateWithFilters({ business_unit: e.target.value })}
                                className={`${adminSelectFieldClass} w-full cursor-pointer appearance-none pr-9 sm:w-52`}
                                aria-label="Filtrar por unidad de negocio"
                            >
                                <option value="">Todas las unidades</option>
                                {options.businessUnits.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>
                </AdminTableToolbar>

                <div className={adminTableCardClass}>
                    <table className="min-w-[60rem] w-full divide-y divide-slate-200 lg:min-w-full">
                        <thead className="border-b border-slate-100 bg-slate-50/50">
                            <tr>
                                <th className={adminTableThClass}>Nombre</th>
                                <th className={adminTableThClass}>Email</th>
                                <th className={adminTableThClass}>Empresa</th>
                                <th className={adminTableThClass}>Teléfono</th>
                                <th className={adminTableThClass}>Cargo</th>
                                <th className={adminTableThCenterClass}>Cotizaciones</th>
                                <th className={adminTableThClass}>Última cotización</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {rows.length > 0 ? (
                                rows.map((client) => (
                                    <tr
                                        key={client.id}
                                        className="cursor-pointer transition hover:bg-slate-50/80"
                                        onClick={() => router.visit(route('dashboard.clients.show', client.id))}
                                    >
                                        <td className={`${adminTableTdClass} font-medium`}>{client.name || '—'}</td>
                                        <td className={adminTableTdClass}>{client.email || '—'}</td>
                                        <td className={adminTableTdClass}>{client.company || '—'}</td>
                                        <td className={adminTableTdClass}>{client.phone || '—'}</td>
                                        <td className={adminTableTdClass}>{client.role || '—'}</td>
                                        <td className={`${adminTableTdClass} text-center`}>
                                            <span className="inline-flex min-w-[2rem] justify-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/80">
                                                {client.quotations_count}
                                            </span>
                                        </td>
                                        <td className={adminTableTdClass}>{formatDate(client.last_quotation_at)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
                                        {filters.search || filters.company || filters.business_unit
                                            ? 'No hay clientes que coincidan con los filtros.'
                                            : 'Aún no hay clientes con cotizaciones registradas.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <AdminPagination
                    routeName="dashboard.clients.index"
                    meta={clients}
                    filters={filters}
                    extraKeys={EXTRA_KEYS}
                />
            </div>
        </AdminLayout>
    );
}
