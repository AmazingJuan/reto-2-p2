import Layout from '@/layouts/Layout';
import React from 'react';


export default function QuotationOrder() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🧾 Cotizaciones completas
        </h1>
        <p className="text-lg text-gray-600 max-w-xl">
          Aquí podrás ver todas tus cotizaciones realizadas.  
          Haz clic en alguna para revisar los detalles.
        </p>
      </div>
    </Layout>
  );
}
