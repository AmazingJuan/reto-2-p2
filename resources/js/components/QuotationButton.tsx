import React from "react";
import { Link } from "@inertiajs/react";

// Botón para la cotización
const QuotationButton = () => (
  <div className="w-full flex justify-center my-12">
    <Link
      href="/cotizar"
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
    >
      Comenzar Cotización
    </Link>
  </div>
);

export default QuotationButton;