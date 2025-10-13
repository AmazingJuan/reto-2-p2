import React from 'react';
import Layout from '@/layouts/Layout';
import { Download } from 'lucide-react';

interface QuotationOrder {
  id: number;
  service_type_id?: number;
  gestion_line_id?: number;
  is_generated: boolean;
  services?: Record<string, any>;
  options?: Record<string, any>;
  quotation_url?: string;
}

interface Props {
  viewData: {
    quotationOrder: QuotationOrder;
  };
}

export default function Show({ viewData }: Props) {
  const { quotationOrder } = viewData;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-8">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm p-10 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            🧾 Detalles de la Cotización #{quotationOrder.id}
          </h1>

          <div className="space-y-5 text-gray-700">
            <div>
              <strong>Estado:</strong>{' '}
              {quotationOrder.is_generated ? (
                <span className="text-green-600 font-medium">Generada ✅</span>
              ) : (
                <span className="text-yellow-600 font-medium">Pendiente ⏳</span>
              )}
            </div>

            {quotationOrder.service_type_id && (
              <div>
                <strong>ID Tipo de servicio:</strong>{' '}
                {quotationOrder.service_type_id}
              </div>
            )}

            {quotationOrder.gestion_line_id && (
              <div>
                <strong>ID Línea de gestión:</strong>{' '}
                {quotationOrder.gestion_line_id}
              </div>
            )}

            {quotationOrder.services && (
              <div>
                <strong>Servicios incluidos:</strong>
                <pre className="bg-gray-100 text-sm rounded-lg p-4 overflow-x-auto mt-2">
                  {JSON.stringify(quotationOrder.services, null, 2)}
                </pre>
              </div>
            )}

            {quotationOrder.options && (
              <div>
                <strong>Opciones adicionales:</strong>
                <pre className="bg-gray-100 text-sm rounded-lg p-4 overflow-x-auto mt-2">
                  {JSON.stringify(quotationOrder.options, null, 2)}
                </pre>
              </div>
            )}

            {quotationOrder.is_generated && quotationOrder.quotation_url ? (
              <div className="pt-4">
                <a
                  href={quotationOrder.quotation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                  title="Descargar cotización"
                >
                  <Download className="w-5 h-5" />
                  <span>Descargar</span>
                </a>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Documento no disponible.
              </p>
            )}
          </div>

          <div className="pt-10">
            <a
              href="/usuario/ordenes-cotizacion"
              className="text-blue-600 font-medium hover:underline"
            >
              ← Volver a mis cotizaciones
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
