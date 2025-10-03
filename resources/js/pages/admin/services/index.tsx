import { usePage, router } from '@inertiajs/react';
import AdminLayout from '../../../layouts/AdminLayout';
import { route } from 'ziggy-js';
import { Pencil, Trash2 } from "lucide-react";

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
    router.delete(route("admin.services.delete", id), {
      onSuccess: () => {
        alert("Servicio borrado correctamente.");
      },
    });
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
    <AdminLayout>
      <div className="p-6">
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
                

                <td className="py-2 px-4 border-b">
                <div className="flex items-center gap-5">
                  {/* Editar */}
                  <button
                    onClick={() => handleEdit(service.id)}
                    className="transition transform hover:scale-110"
                    title="Editar"
                  >
                    <Pencil className="h-6 w-6 text-blue-500 hover:text-blue-600" />
                  </button>

                  {/* Borrar */}
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="transition transform hover:scale-110"
                    title="Borrar"
                  >
                    <Trash2 className="h-6 w-6 text-red-600 hover:text-red-700" />
                  </button>
                </div>
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
      </div>
    </AdminLayout>
  );
}