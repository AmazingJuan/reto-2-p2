import AdminLayout from '@/layouts/admin-layout';
import { usePage } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { route } from 'ziggy-js';

interface QuotationOrder {
    id: number;
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
        window.open(url, '_blank'); // abre la URL de descarga en nueva pestaña
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="mb-6 text-center text-3xl font-bold leading-tight text-slate-900 md:text-3xl">Órdenes de Cotización</h1>

                <table className="min-w-full rounded-lg border bg-white shadow">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="border-b px-4 py-2">ID</th>
                            <th className="border-b px-4 py-2">Estado</th>
                            <th className="border-b px-4 py-2 text-center">Descarga</th>
                        </tr>
                    </thead>

                    <tbody>
                        {quotationOrders.length > 0 ? (
                            quotationOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => (window.location.href = route('admin.quotation-orders.show', order.id))}
                                >
                                    <td className="border-b px-4 py-2">{order.id}</td>

                                    <td className="border-b px-4 py-2">
                                        {order.is_generated ? (
                                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">Generada</span>
                                        ) : (
                                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                                                Pendiente
                                            </span>
                                        )}
                                    </td>

                                    <td className="border-b px-4 py-2 text-center">
                                        {order.is_generated && order.quotation_url ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // evita redirección al hacer clic
                                                    handleDownload(order.quotation_url!);
                                                }}
                                                className="transform text-blue-600 transition hover:scale-110 hover:text-blue-800"
                                                title="Descargar cotización"
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
                                <td colSpan={3} className="py-4 text-center text-gray-500">
                                    No hay órdenes de cotización registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
