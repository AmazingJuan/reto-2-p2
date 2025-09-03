// resources/js/Pages/portfolio/cotizar.tsx
import React, { useState } from "react";
import Layout from "../../layouts/Layout";

const Cotizar = () => {
  const [viaticos, setViaticos] = useState<string[]>([]);
  const [modalidad, setModalidad] = useState<string | null>(null);

  const toggleViatico = (item: string) => {
    setViaticos((prev) =>
      prev.includes(item) ? prev.filter((v) => v !== item) : [...prev, item]
    );
  };

  const selectModalidad = (item: string) => {
    setModalidad(item);
  };

  return (
    <Layout
      heroContent={
        <div>
          <h1 className="text-4xl font-bold">Cotización</h1>
          <p className="mt-2 text-lg">
            Bienvenido a la página de cotización.
          </p>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center py-20 space-y-12 w-full relative">
        <p className="text-lg text-gray-700 text-center">
          Por favor selecciona las características que se cubrirán por parte del cliente:
        </p>

        {/* ====== VIATICOS ====== */}
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Viáticos</h2>
          <div className="grid grid-cols-2 gap-4">
            {["Tiquetes", "Alimentación", "Alojamiento", "Transporte local"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => toggleViatico(item)}
                  className={`border-2 rounded-lg py-3 text-lg font-medium transition ${
                    viaticos.includes(item)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-400 hover:border-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>

        {/* ====== MODALIDAD ====== */}
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Modalidad</h2>
          <div className="grid grid-cols-3 gap-4">
            {["Presencial", "Virtual", "Mixto"].map((item) => (
              <button
                key={item}
                onClick={() => selectModalidad(item)}
                className={`border-2 rounded-lg py-3 text-lg font-medium transition ${
                  modalidad === item
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-400 hover:border-blue-600 hover:bg-blue-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* ====== BOTÓN COTIZAR ====== */}
        <div className="absolute bottom-0 right-0 mb-6 mr-6">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition">
            Cotizar
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Cotizar;
