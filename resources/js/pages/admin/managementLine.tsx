// resources/js/pages/admin/ManagementLine.tsx
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Header from "../../components/admin/Header";
import Footer from "../../components/admin/Footer";
import "./managementLine.css"; // Estilos específicos para esta vista

const ManagementLine: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !descripcion.trim()) {
      alert("Todos los campos son obligatorios");
      return;
    }

    // Aquí iría la lógica de envío al backend
    alert("Línea de gestión agregada correctamente");

    setNombre("");
    setDescripcion("");
  };

  return (
    <div className="management-container">
      <Header />

      <main className="management-main">
        <section className="management-section">
          <h1 className="management-title">Crear nueva línea de gestión</h1>

          <div className="management-card">
            <form onSubmit={handleSubmit} className="management-form">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  placeholder="Nombre de la línea de gestión"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  placeholder="Descripción de la línea de gestión"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={4}
                />
              </div>

              <button type="submit" className="btn-primary">
                Guardar
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ManagementLine;

if (typeof document !== "undefined" && document.getElementById("app")) {
  ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
    <React.StrictMode>
      <ManagementLine />
    </React.StrictMode>
  );
}
