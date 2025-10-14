import React from 'react';
import Layout from '@/layouts/Layout';
import { Download } from 'lucide-react';

interface QuotationOrder {
  id: string;
  service_type_id?: string;
  gestion_line_id?: number;
  is_generated: boolean;
  services?: { id: string; name: string }[];
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

  const renderOptions = (data: Record<string, any>) => (
    <div className="grid gap-2 mt-2">
      {Object.entries(data).map(([key, value]) => (
        <div
          key={key}
          className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 flex justify-between"
        >
          <span className="font-medium text-gray-700">{key}:</span>
          <span className="text-gray-600">
            {Array.isArray(value) ? value.join(', ') : String(value)}
          </span>
        </div>
      ))}
    </div>
  );

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

            {quotationOrder.services && quotationOrder.services.length > 0 && (
              <div>
                <strong>Servicios incluidos:</strong>
                <ul className="list-disc list-inside mt-2">
                  {quotationOrder.services.map((service) => (
                    <li key={service.id} className="text-gray-600">
                      {service.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {quotationOrder.options && (
              <div>
                <strong>Opciones adicionales:</strong>
                {renderOptions(quotationOrder.options)}
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
              <p className="text-gray-500 italic">Documento no disponible.</p>
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
