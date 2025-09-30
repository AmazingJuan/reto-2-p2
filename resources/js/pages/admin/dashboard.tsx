// resources/js/pages/admin/dashboard.tsx
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Header from "../../components/admin/Header";
import Footer from "../../components/admin/Footer";
import "./dashboard.css"; // Importamos el CSS

const Dashboard: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [guardados, setGuardados] = useState<any[]>([]);
  const [tab, setTab] = useState<"gestion" | "cotizaciones">("gestion");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !descripcion.trim() || !categoria) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const nuevo = { nombre, descripcion, categoria };
    setGuardados((prev) => [...prev, nuevo]);
    alert("Servicio/Línea agregado correctamente");

    setNombre("");
    setDescripcion("");
    setCategoria("");
  };

  return (
    <div className="dashboard-container">
      <Header />

      <div className="dashboard-content">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <h2 className="sidebar-title">Menú</h2>
          <nav className="sidebar-nav">
            <button
              onClick={() => setTab("gestion")}
              className={`nav-button ${tab === "gestion" ? "active" : ""}`}
            >
              Gestión
            </button>
            <button
              onClick={() => setTab("cotizaciones")}
              className={`nav-button ${tab === "cotizaciones" ? "active" : ""}`}
            >
              Cotizaciones
            </button>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="main">
          {tab === "gestion" ? (
            <section>
              <h1 className="section-title">Gestión de Servicios y Líneas</h1>

              <div className="card">
                <h2 className="card-title">Agregar nuevo servicio o línea</h2>

                <form onSubmit={handleSubmit} className="form">
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      placeholder="Nombre del servicio o línea"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      placeholder="Descripción"
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

              {/* Lista de servicios */}
              <div className="card mt">
                <h3 className="card-title">Servicios/Líneas creados</h3>
                {guardados.length === 0 ? (
                  <p className="empty">No hay servicios creados aún.</p>
                ) : (
                  <ul className="list">
                    {guardados.map((item, i) => (
                      <li key={i} className="list-item">
                        <span className="item-name">{item.nombre}</span> –{" "}
                        {item.descripcion}{" "}
                        <span className="item-category">
                          ({item.categoria})
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ) : (
            <section>
              <h1 className="section-title">Listado de Cotizaciones</h1>
              <div className="card">
                <p>Aquí se mostrarán todas las cotizaciones creadas.</p>
                <small className="note">
                  (Mock frontend — aún no conectado a la base de datos)
                </small>
              </div>
            </section>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;

if (typeof document !== "undefined" && document.getElementById("app")) {
  ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
    <React.StrictMode>
      <Dashboard />
    </React.StrictMode>
  );
}
