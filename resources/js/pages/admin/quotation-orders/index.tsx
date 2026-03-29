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
            <div className="w-full min-w-0 space-y-4">
                <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <ScrollText className="h-7 w-7 shrink-0 text-blue-600 sm:h-8 sm:w-8" />
                        <div className="min-w-0 text-left">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Órdenes de cotización</h1>
                            <p className="mt-1 text-sm text-gray-600">Listado de solicitudes y estado de generación</p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto w-full min-w-0 max-w-7xl">
                    <FlashAlert flash={flash} />
                </div>

                <div className="mx-auto w-full min-w-0 max-w-7xl">
                    <AdminTableToolbar
                        routeName="dashboard.quotation-orders.index"
                        filters={filters}
                        searchPlaceholder="ID, correo, nombre, empresa, unidad…"
                        className="max-w-7xl"
                    />
                </div>

                <div className="mx-auto w-full min-w-0 max-w-7xl overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm [-webkit-overflow-scrolling:touch]">
                    <table className="min-w-[56rem] w-full divide-y divide-gray-200 lg:min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">ID</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Nombre</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Email</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Empresa</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Cargo</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Estado</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Unidad</th>
                                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Propuesta</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {rows.length > 0 ? (
                                rows.map((order) => (
                                    <tr
                                        key={String(order.id)}
                                        className="cursor-pointer transition hover:bg-gray-50"
                                        onClick={() => router.visit(route('dashboard.quotation-orders.show', order.id))}
                                    >
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.id}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.contact_info?.name || '—'}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.contact_info?.email || '—'}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.contact_info?.company || '—'}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.contact_info?.role || '—'}</td>
                                        <td className="px-3 py-3 text-sm sm:px-6 sm:py-4">
                                            {order.is_generated ? (
                                                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                    Generada
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                                                    Pendiente
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{order.business_unit ?? '—'}</td>
                                        <td className="px-3 py-3 text-center sm:px-6 sm:py-4" onClick={(e) => e.stopPropagation()}>
                                            {order.is_generated && order.quotation_url ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDownload(order.quotation_url!)}
                                                    className="text-blue-600 transition hover:text-blue-800"
                                                    title="Abrir propuesta"
                                                >
                                                    <Download className="inline h-5 w-5" />
                                                </button>
                                            ) : (
                                                <span className="text-sm text-gray-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500 sm:px-6">
                                        {filters.search ? 'No hay resultados para tu búsqueda.' : 'No hay órdenes de cotización registradas.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mx-auto w-full min-w-0 max-w-7xl">
                    <AdminPagination
                        routeName="dashboard.quotation-orders.index"
                        meta={quotationOrders}
                        filters={filters}
                        className="max-w-7xl"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
