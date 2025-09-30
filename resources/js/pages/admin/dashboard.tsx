import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Header from "../../components/admin/Header";
import Footer from "../../components/admin/Footer";

import Service from "./service";
import ManagementLine from "./managementLine";
import Quotation from "./quotation";

import "./dashboard.css";


// Vista principal con las 3 tarjetas
// Vista principal con las 3 tarjetas
const DashboardHome: React.FC = () => {
  return (
    <div className="dashboard-container">
      <Header />

      <main className="main">
        <h1 className="section-title">Administrador</h1>

        <div className="card-container">
          {/* Card 1 */}
          <div className="card">
            <h2>Crear Servicio</h2>
            <p>
              Desde aquí podrás registrar un nuevo servicio dentro del sistema.
            </p>
            <Link to="/admin/dashboard/service" className="btn btn-service">
              Ir
            </Link>
          </div>

          {/* Card 2 */}
          <div className="card">
            <h2>Crear Línea de Gestión</h2>
            <p>
              Agrega una nueva línea de gestión para organizar los procesos.
            </p>
            <Link to="/admin/dashboard/managementLine" className="btn btn-management">
              Ir
            </Link>
          </div>

          {/* Card 3 */}
          <div className="card">
            <h2>Ver Cotizaciones</h2>
            <p>
              Consulta y gestiona las cotizaciones ya existentes en el sistema.
            </p>
            <Link to="/admin/dashboard/quotation" className="btn btn-quotation">
              Ir
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};



// Enrutador principal
function DashboardApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/dashboard" element={<DashboardHome />} />
        <Route path="/admin/dashboard/service" element={<Service />} />
        <Route path="/admin/dashboard/managementLine" element={<ManagementLine />} />
        <Route path="/admin/dashboard/quotation" element={<Quotation />} />
      </Routes>
    </BrowserRouter>
  );
}


// Renderizado en el div#app
if (document.getElementById("app")) {
  ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
    <React.StrictMode>
      <DashboardApp />
    </React.StrictMode>
  );
}
