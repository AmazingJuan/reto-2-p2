import React from "react";
import Layout from "../layouts/Layout";

export default function Quotation() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h1 className="text-4xl font-bold mb-6">Solicita tu cotización</h1>
        <p className="text-lg text-gray-700 mb-8">
          Completa el siguiente formulario para que podamos enviarte una cotización personalizada de nuestros servicios.
        </p>
        {/* Aquí irá el formulario de cotización */}
        <div className="bg-gray-100 rounded-lg p-8 text-gray-600">
          <p>Próximamente: Formulario de cotización.</p>
        </div>
      </div>
    </Layout>
  );
}
