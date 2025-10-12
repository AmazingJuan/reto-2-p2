import { usePage, Link } from "@inertiajs/react";
import AdminLayout from "../../../layouts/AdminLayout";
import { ArrowLeft, Download } from "lucide-react";

interface QuotationOrder {
  id: number;
  is_generated: boolean;
  services?: Record<string, any>;
  options?: Record<string, any>;
  quotation_url?: string;
}

interface PageProps {
  viewData: {
    quotationOrder: QuotationOrder;
  };
}

export default function Show() {
  const { viewData } = usePage<PageProps>().props;
  const { quotationOrder } = viewData;

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href={route("admin.quotation_orders.index")}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-1" /> Volver
            </Link>
            <h1 className="text-2xl font-bold">
              Cotización #{quotationOrder.id}
            </h1>
          </div>

          {quotationOrder.is_generated && quotationOrder.quotation_url && (
            <a
              href={quotationOrder.quotation_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Download className="h-5 w-5 mr-2" />
              Descargar PDF
            </a>
          )}
        </div>

        {/* Info general */}
        <div className="bg-white shadow rounded-lg p-6 border">
          <div className="mb-4">
            <p className="text-sm text-gray-500">ID</p>
            <p className="text-lg font-semibold">{quotationOrder.id}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">Estado</p>
            <p
              className={`text-lg font-semibold ${
                quotationOrder.is_generated ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {quotationOrder.is_generated ? "Generada" : "Pendiente"}
            </p>
          </div>

          {/* Servicios */}
          {quotationOrder.services && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Servicios</p>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(quotationOrder.services, null, 2)}
              </pre>
            </div>
          )}

          {/* Opciones */}
          {quotationOrder.options && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Opciones</p>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(quotationOrder.options, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
