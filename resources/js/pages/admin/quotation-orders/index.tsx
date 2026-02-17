import AdminLayout from '@/layouts/admin-layout';
import { usePage } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { route } from 'ziggy-js';

interface QuotationOrder {
    id: number;
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

interface IndexPageProps extends Record<string, unknown> {
    auth: { user: any };
    viewData: {
        quotationOrders: QuotationOrder[];
    };
}

export default function Index() {
    const { viewData } = usePage<IndexPageProps>().props;
    const quotationOrders = viewData.quotationOrders;

    const handleDownload = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="mb-6 text-center text-3xl font-bold leading-tight text-slate-900 md:text-3xl">Órdenes de Cotización</h1>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Empresa</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cargo</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Abrir propuesta</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {quotationOrders.length > 0 ? (
                            quotationOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => (window.location.href = route('dashboard.quotation-orders.show', order.id))}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.contact_info?.name || '—'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.contact_info?.email || '—'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.contact_info?.company || '—'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.contact_info?.role || '—'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {order.is_generated ? (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">Generada</span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">Pendiente</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {order.is_generated && order.quotation_url ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownload(order.quotation_url!);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                title="Abrir propuesta enviada al cliente"
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
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No hay órdenes de cotización registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            </div>
        </AdminLayout>
    );
}
