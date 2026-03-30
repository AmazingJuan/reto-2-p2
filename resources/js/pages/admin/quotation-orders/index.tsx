import {
    AdminPageHeader,
    adminListShellClass,
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
import { router, usePage } from '@inertiajs/react';
import { Download, ScrollText } from 'lucide-react';
import { route } from 'ziggy-js';

interface QuotationOrder {
    business_unit?: string;
    quotation_code?: string | null;
    id: number | string;
    contact_info?: {
        name: string;
        email: string;
        company?: string | null;
        phone?: string;
        role?: string;
    };
    is_generated: boolean;
    quotation_url?: string;
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
        quotationOrders: Paginated<QuotationOrder>;
        filters: {
            search: string;
        };
    };
}>;

export default function Index() {
    const { viewData, flash } = usePage<IndexPageProps & { flash: Record<string, unknown> }>().props;
    const { quotationOrders, filters } = viewData;
    const rows = quotationOrders.data;

    const handleDownload = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <AdminLayout>
            <div className={adminListShellClass}>
                <AdminPageHeader
                    icon={ScrollText}
                    title="Órdenes de cotización"
                    description="Listado de solicitudes y estado de generación"
                />

                <FlashAlert flash={flash} />

                <AdminTableToolbar
                    routeName="dashboard.quotation-orders.index"
                    filters={filters}
                    searchPlaceholder="Código, correo, nombre, unidad…"
                />

                <div className={adminTableCardClass}>
                    <table className="min-w-[56rem] w-full divide-y divide-slate-200 lg:min-w-full">
                        <thead className="border-b border-slate-100 bg-slate-50/50">
                            <tr>
                                <th className={adminTableThClass}>Código</th>
                                <th className={adminTableThClass}>Nombre</th>
                                <th className={adminTableThClass}>Email</th>
                                <th className={adminTableThClass}>Empresa</th>
                                <th className={adminTableThClass}>Cargo</th>
                                <th className={adminTableThClass}>Estado</th>
                                <th className={adminTableThClass}>Unidad</th>
                                <th className={adminTableThCenterClass}>Propuesta</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {rows.length > 0 ? (
                                rows.map((order) => (
                                    <tr
                                        key={String(order.id)}
                                        className="cursor-pointer transition hover:bg-slate-50/80"
                                        onClick={() => router.visit(route('dashboard.quotation-orders.show', order.id))}
                                    >
                                        <td className={`${adminTableTdClass} font-mono text-sm`}>{order.quotation_code || '—'}</td>
                                        <td className={adminTableTdClass}>{order.contact_info?.name || '—'}</td>
                                        <td className={adminTableTdClass}>{order.contact_info?.email || '—'}</td>
                                        <td className={adminTableTdClass}>{order.contact_info?.company || '—'}</td>
                                        <td className={adminTableTdClass}>{order.contact_info?.role || '—'}</td>
                                        <td className={adminTableTdClass}>
                                            {order.is_generated ? (
                                                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200/80">
                                                    Generada
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 ring-1 ring-amber-200/80">
                                                    Pendiente
                                                </span>
                                            )}
                                        </td>
                                        <td className={adminTableTdClass}>{order.business_unit ?? '—'}</td>
                                        <td className={`${adminTableTdClass} text-center`} onClick={(e) => e.stopPropagation()}>
                                            {order.is_generated && order.quotation_url ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDownload(order.quotation_url!)}
                                                    className="rounded-lg p-2 text-[#0693e3] transition hover:bg-blue-50 hover:text-[#047ac0]"
                                                    title="Abrir propuesta"
                                                >
                                                    <Download className="inline h-5 w-5" />
                                                </button>
                                            ) : (
                                                <span className="text-sm text-slate-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
                                        {filters.search ? 'No hay resultados para tu búsqueda.' : 'No hay órdenes de cotización registradas.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <AdminPagination routeName="dashboard.quotation-orders.index" meta={quotationOrders} filters={filters} />
            </div>
        </AdminLayout>
    );
}
