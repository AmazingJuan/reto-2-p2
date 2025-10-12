import { usePage, Link } from "@inertiajs/react";
import AdminLayout from "../../../layouts/AdminLayout";
import { ArrowLeft, Download } from "lucide-react";
import { route } from "ziggy-js";

interface QuotationOrder {
  id: number;
  service_type_id?: number;
  gestion_line_id?: number;
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


  if (!quotationOrder) {
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-500">
          No se encontró la cotización.
        </div>
      </AdminLayout>
    );
  }

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

          {/* Botón de descarga (solo si está generada) */}
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

        {/* Información principal */}
        <div className="bg-white shadow rounded-lg p-6 border space-y-4">
          <div>
            <p className="text-sm text-gray-500">ID</p>
            <p className="text-lg font-semibold">{quotationOrder.id}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Estado</p>
            <p
              className={`text-lg font-semibold ${
                quotationOrder.is_generated ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {quotationOrder.is_generated ? "Generada" : "Pendiente"}
            </p>
          </div>

          {quotationOrder.service_type_id && (
            <div>
              <p className="text-sm text-gray-500">Tipo de servicio</p>
              <p className="text-lg">{quotationOrder.service_type_id}</p>
            </div>
          )}

          {quotationOrder.gestion_line_id && (
            <div>
              <p className="text-sm text-gray-500">Línea de gestión</p>
              <p className="text-lg">{quotationOrder.gestion_line_id}</p>
            </div>
          )}

          {/* Servicios */}
          {quotationOrder.services && (
            <div>
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
