import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";

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

const QuotationIndex: React.FC<Props> = ({ viewData }) => {
  const quotationOrders = viewData.quotationOrders || [];
  const [selectedQuotation, setSelectedQuotation] = useState<number | null>(null);
  const [quotationUrls, setQuotationUrls] = useState<Record<number, string>>(
    Object.fromEntries(quotationOrders.map((q) => [q.id, q.quotation_url || ""]))
  );
  const [loading, setLoading] = useState(false);

  const handleSelect = (id: number) => {
    setSelectedQuotation(id);
  };

  const handleUrlChange = (id: number, value: string) => {
    setQuotationUrls((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAction = async () => {
    if (!selectedQuotation) {
      alert("Por favor selecciona una cotización antes de continuar.");
      return;
    }

    const url = quotationUrls[selectedQuotation];
    if (!url.trim()) {
      alert("Por favor ingresa una URL válida antes de actualizar.");
      return;
    }

    try {
      setLoading(true);

      await axios.patch(
        route("quotation_order.confirm", selectedQuotation),
        { url },
        { withCredentials: true }
      );

      alert(`La URL de la cotización #${selectedQuotation} fue actualizada correctamente.`);
    } catch (error) {
      console.error("Error al actualizar la URL:", error);
      alert("Hubo un error al actualizar la URL. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Head title="Listado de Cotizaciones" />

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Cotizaciones Pendientes
      </h1>

      {quotationOrders.length === 0 ? (
        <p className="text-gray-600">No hay cotizaciones pendientes por generar.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">¿Generada?</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">URL</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {quotationOrders.map((quotation) => (
              <tr
                key={quotation.id}
                className={`border-b hover:bg-gray-50 transition ${
                  selectedQuotation === quotation.id ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-6 py-3 text-gray-800">{quotation.id}</td>
                <td className="px-6 py-3">
                  {quotation.is_generated ? (
                    <span className="text-green-600 font-semibold">Sí</span>
                  ) : (
                    <span className="text-red-500 font-semibold">No</span>
                  )}
                </td>
                <td className="px-6 py-3">
                  <input
                    type="text"
                    value={quotationUrls[quotation.id] || ""}
                    onChange={(e) => handleUrlChange(quotation.id, e.target.value)}
                    placeholder="Ingrese o edite la URL"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </td>
                <td className="px-6 py-3 text-center">
                  <input
                    type="radio"
                    name="selectedQuotation"
                    checked={selectedQuotation === quotation.id}
                    onChange={() => handleSelect(quotation.id)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleAction}
          disabled={!selectedQuotation || loading}
          className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-all ${
            !selectedQuotation || loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Actualizando..." : "Actualizar URL"}
        </button>
      </div>
    </div>
  );
};

export default QuotationIndex;
