import React from 'react';
import Layout from '@/layouts/Layout';
import { Download } from 'lucide-react';

interface QuotationOrder {
  id: number;
  is_generated: boolean;
  quotation_url?: string;
}

interface Props {
  viewData: {
    quotationOrders: QuotationOrder[];
  };
}

export default function Index({ viewData }: Props) {
  const { quotationOrders } = viewData;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-10 border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-12 flex items-center justify-center gap-2">
            <span role="img" aria-label="document">🧾</span> Mis Cotizaciones
          </h1>

          {!quotationOrders || quotationOrders.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              No tienes cotizaciones generadas todavía.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quotationOrders.map((q) => (
                <div
                  key={q.id}
                  className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all bg-gray-50"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Cotización #{q.id}
                  </h2>

                  <p
                    className={`text-sm font-medium mb-3 ${
                      q.is_generated ? 'text-green-600' : 'text-yellow-600'
                    }`}
                  >
                    {q.is_generated ? 'Generada ✅' : 'Pendiente ⏳'}
                  </p>

                  <div className="flex items-center justify-between">
                    {/* Enlace al show */}
                    <a
                      href={`/usuario/ordenes-cotizacion/${q.id}`}
                      className="text-blue-600 font-medium hover:underline"
                      title={`Ver detalles de la cotización ${q.id}`}
                    >
                      Ver detalles
                    </a>

                    {/* Descarga (si existe) */}
                    {q.is_generated && q.quotation_url ? (
                      <a
                        href={q.quotation_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition-colors"
                        title="Descargar cotización"
                      >
                        <Download className="h-5 w-5" />
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm italic">
                        - No disponible
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
