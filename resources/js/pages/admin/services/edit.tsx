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
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Editar Servicio</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-600 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Tipo de servicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Servicio
            </label>
            <select
              value={data.service_type_id}
              onChange={(e) => setData("service_type_id", e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione un tipo</option>
              {serviceTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.service_type_id && (
              <p className="text-red-600 text-sm">{errors.service_type_id}</p>
            )}
          </div>

          {/* Línea de gestión */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Línea de Gestión
            </label>
            <select
              value={data.gestion_line_id}
              onChange={(e) => setData("gestion_line_id", e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione una línea</option>
              {gestionLines.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.name}
                </option>
              ))}
            </select>
            {errors.gestion_line_id && (
              <p className="text-red-600 text-sm">{errors.gestion_line_id}</p>
            )}
          </div>

          {/* Botón */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Actualizar
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
