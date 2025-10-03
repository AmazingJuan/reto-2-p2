import { useForm, usePage } from "@inertiajs/react";
import Header from "../../../components/admin/Header";
import Footer from "../../../components/admin/Footer";
import { route } from "ziggy-js";

interface Service {
  id: number;
  name: string;
  description: string;
  service_type_id: string;
  gestion_line_id: number;
}

interface ServiceType {
  id: string;
  name: string;
}

interface GestionLine {
  id: number;
  name: string;
}

interface PageProps {
  service: Service;
  serviceTypes: ServiceType[];
  gestionLines: GestionLine[];
}

export default function Edit() {
  const { service, serviceTypes, gestionLines } = usePage<PageProps>().props;

  const { data, setData, put, processing, errors } = useForm({
    name: service.name || "",
    description: service.description || "",
    service_type_id: service.service_type_id || "",
    gestion_line_id: service.gestion_line_id || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("admin.services.update", service.id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Editar Servicio</h1>
            <p className="mt-2 text-sm text-gray-600">Modifique los campos necesarios para actualizar el servicio</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Información básica */}
              <div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Nombre */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Ingrese el nombre del servicio"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData("description", e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      rows={4}
                      placeholder="Ingrese una descripción detallada del servicio"
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Clasificación */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  Clasificación
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tipo de servicio */}
                  <div>
                    <label htmlFor="service_type_id" className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Servicio <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="service_type_id"
                      value={data.service_type_id}
                      onChange={(e) => setData("service_type_id", e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="">Seleccione un tipo</option>
                      {serviceTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {errors.service_type_id && (
                      <p className="mt-2 text-sm text-red-600">{errors.service_type_id}</p>
                    )}
                  </div>

                  {/* Línea de gestión */}
                  <div>
                    <label htmlFor="gestion_line_id" className="block text-sm font-medium text-gray-700 mb-2">
                      Línea de Gestión <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gestion_line_id"
                      value={data.gestion_line_id}
                      onChange={(e) => setData("gestion_line_id", e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="">Seleccione una línea</option>
                      {gestionLines.map((line) => (
                        <option key={line.id} value={line.id}>
                          {line.name}
                        </option>
                      ))}
                    </select>
                    {errors.gestion_line_id && (
                      <p className="mt-2 text-sm text-red-600">{errors.gestion_line_id}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing ? "Actualizando..." : "Actualizar Servicio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
