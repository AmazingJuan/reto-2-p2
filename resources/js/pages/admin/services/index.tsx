import { usePage, router } from '@inertiajs/react';
import Header from '../../../components/admin/Header';
import Footer from '../../../components/admin/Footer';
import { route } from 'ziggy-js';

interface Service {
  id: number;
  name: string;
  description: string;
}

interface PageProps {
  services: Service[];
}

export default function Index() {
  const { services } = usePage<PageProps>().props;

  // Acción: borrar servicio
const handleDelete = (id: number) => {
  if (confirm("¿Seguro que deseas borrar este servicio?")) {
    router.delete(route("admin.services.delete", id)); 
  }
};

  // Acción: ir a editar
  const handleEdit = (id: number) => {
    router.get(route("admin.services.edit", id));
  };

  // Acción: ir a crear
  const handleCreate = () => {
    router.get(route("admin.services.create"));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Administrar Servicios</h1>

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
        >
          Crear servicio
        </button>

        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Descripción</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{service.id}</td>
                <td className="py-2 px-4 border-b">{service.name}</td>
                <td className="py-2 px-4 border-b">{service.description}</td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    onClick={() => handleEdit(service.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}

            {services.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No hay servicios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}