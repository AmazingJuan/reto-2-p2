import React from "react";

// Botón para la cotización

const QuotationButton = () => (
  <div className="w-full flex justify-center my-12">
    <a
      href="/cotizacion"
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
    >
      Comenzar Cotización
    </a>
  </div>
);

export default QuotationButton;