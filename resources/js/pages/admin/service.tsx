// resources/js/pages/admin/service.tsx
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Header from "../../components/admin/Header";
import Footer from "../../components/admin/Footer";
import "./service.css"; // Importamos estilos propios de este formulario

const Service: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !descripcion.trim() || !categoria) {
      alert("Todos los campos son obligatorios");
      return;
    }

    // Aquí iría la lógica de envío al backend
    alert("Servicio agregado correctamente");

    setNombre("");
    setDescripcion("");
    setCategoria("");
  };

  return (
    <div className="service-container">
      <Header />

      <main className="service-main">
        <section className="service-section">
          <h1 className="service-title">Crear nuevo servicio</h1>

          <div className="service-card">
            <form onSubmit={handleSubmit} className="service-form">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  placeholder="Nombre del servicio"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  placeholder="Descripción del servicio"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Categoría</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="">Seleccione categoría</option>
                  <option value="servicio">Servicio</option>
                  <option value="linea">Línea de gestión</option>
                </select>
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

export default Service;

if (typeof document !== "undefined" && document.getElementById("app")) {
  ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
    <React.StrictMode>
      <Service />
    </React.StrictMode>
  );
}
