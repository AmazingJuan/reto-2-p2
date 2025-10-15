// resources/js/pages/admin/quotation.tsx
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Header from "../../components/admin/Header";
import Footer from "../../components/admin/Footer";
import "./quotation.css"; // Estilos específicos para la vista de cotizaciones

const Quotation: React.FC = () => {
  // Datos simulados de cotizaciones
  const [cotizaciones] = useState([
    {
      id: 1,
      cliente: "Empresa ABC",
      servicio: "Consultoría",
      monto: "$1,500",
      fecha: "2025-09-20",
    },
    {
      id: 2,
      cliente: "Cliente XYZ",
      servicio: "Desarrollo Web",
      monto: "$3,000",
      fecha: "2025-09-25",
    },
  ]);

  return (
    <div className="quotation-container">
      <Header />

      <main className="quotation-main">
        <section className="quotation-section">
          <h1 className="quotation-title">Listado de Cotizaciones</h1>

          <div className="quotation-card">
            {cotizaciones.length === 0 ? (
              <p className="empty">No hay cotizaciones disponibles.</p>
            ) : (
              <table className="quotation-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Servicio</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {cotizaciones.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.cliente}</td>
                      <td>{c.servicio}</td>
                      <td>{c.monto}</td>
                      <td>{c.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Quotation;

if (typeof document !== "undefined" && document.getElementById("app")) {
  ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
    <React.StrictMode>
      <Quotation />
    </React.StrictMode>
  );
}
