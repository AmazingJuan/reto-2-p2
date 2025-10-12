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
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href={route("admin.quotation-orders.index")}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-1" /> Volver
            </Link>
            <h1 className="text-2xl font-bold">
              Cotización #{quotationOrder.id}
            </h1>
          </div>

          {/* Botón de descarga */}
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

        {/* Contenido principal */}
        <div className="bg-white shadow-md rounded-lg border p-6">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-3 font-semibold text-gray-600 w-1/3">
                  ID
                </td>
                <td className="py-3">{quotationOrder.id}</td>
              </tr>

              <tr className="border-b">
                <td className="py-3 font-semibold text-gray-600">Estado</td>
                <td className="py-3">
                  {quotationOrder.is_generated ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Generada
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Pendiente
                    </span>
                  )}
                </td>
              </tr>

              {quotationOrder.service_type_id && (
                <tr className="border-b">
                  <td className="py-3 font-semibold text-gray-600">
                    Tipo de servicio
                  </td>
                  <td className="py-3">{quotationOrder.service_type_id}</td>
                </tr>
              )}

              {quotationOrder.gestion_line_id && (
                <tr className="border-b">
                  <td className="py-3 font-semibold text-gray-600">
                    Línea de gestión
                  </td>
                  <td className="py-3">{quotationOrder.gestion_line_id}</td>
                </tr>
              )}

              {/* Servicios */}
              {quotationOrder.services && (
                <tr className="border-b align-top">
                  <td className="py-3 font-semibold text-gray-600">Servicios</td>
                  <td className="py-3">
                    <ul className="list-disc ml-5 space-y-1">
                      {Object.entries(quotationOrder.services).map(
                        ([key, value]) => (
                          <li key={key}>
                            <span className="font-medium">{key}: </span>
                            {String(value)}
                          </li>
                        )
                      )}
                    </ul>
                  </td>
                </tr>
              )}

              {/* Opciones */}
              {quotationOrder.options && (
                <tr className="align-top">
                  <td className="py-3 font-semibold text-gray-600">Opciones</td>
                  <td className="py-3">
                    <ul className="list-disc ml-5 space-y-1">
                      {Object.entries(quotationOrder.options).map(
                        ([key, value]) => (
                          <li key={key}>
                            <span className="font-medium">{key}: </span>
                            {String(value)}
                          </li>
                        )
                      )}
                    </ul>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
