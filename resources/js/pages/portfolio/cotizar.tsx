// resources/js/Pages/portfolio/cotizar.tsx
import React from "react";
import Layout from "../../layouts/Layout";

const Cotizar = () => (
  <Layout
    heroContent={
      <div>
        <h1 className="text-4xl font-bold">Cotización</h1>
        <p className="mt-2 text-lg">
          Bienvenido a la página de cotización. Aquí podrás solicitar tu presupuesto personalizado.
        </p>
      </div>
    }
  >
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-lg text-gray-700">
        Selecciona los servicios y completa tu información para generar una cotización adaptada a tus necesidades.
      </p>
    </div>
  </Layout>
);

export default Cotizar;
