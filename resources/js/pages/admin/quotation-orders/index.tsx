import { usePage } from "@inertiajs/react";
import AdminLayout from "../../../layouts/AdminLayout";
import { Download } from "lucide-react";
import { route } from "ziggy-js";

interface QuotationOrder {
  id: number;
  is_generated: boolean;
  quotation_url?: string;
}

interface PageProps {
  viewData: {
    quotationOrders: QuotationOrder[];
  };
}

export default function Index() {
  const { viewData } = usePage<PageProps>().props;
  const quotationOrders = viewData.quotationOrders;

  const handleDownload = (url: string) => {
    window.open(url, "_blank"); // abre la URL de descarga en nueva pestaña
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Órdenes de Cotización</h1>

        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Estado</th>
              <th className="py-2 px-4 border-b text-center">Descarga</th>
            </tr>
          </thead>

          <tbody>
            {quotationOrders.length > 0 ? (
              quotationOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    (window.location.href = route(
                      "admin.quotation-orders.show",
                      order.id
                    ))
                  }
                >
                  <td className="py-2 px-4 border-b">{order.id}</td>

                  <td className="py-2 px-4 border-b">
                    {order.is_generated ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Generada
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Pendiente
                      </span>
                    )}
                  </td>

                  <td className="py-2 px-4 border-b text-center">
                    {order.is_generated && order.quotation_url ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // evita redirección al hacer clic
                          handleDownload(order.quotation_url!);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition transform hover:scale-110"
                        title="Descargar cotización"
                      >
                        <Download className="h-5 w-5 inline" />
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
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
