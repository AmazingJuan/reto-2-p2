import { usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js"; 
import Header from "@/components/admin/Header";
import Footer from "@/components/admin/Footer";
import { Pencil, Trash2 } from "lucide-react";

interface GestionLine {
  id: number;
  name: string;
}

interface PageProps {
  gestionLines: GestionLine[];
}

export default function Index() {
  const { gestionLines } = usePage<PageProps>().props;

  // Acción: borrar línea de gestión
  const handleDelete = (id: number) => {
  if (confirm("¿Seguro que deseas borrar esta línea de gestión?")) {
    router.delete(route("admin.lines.delete", id), {
      onSuccess: () => {
        alert("Linea de gestión borrada correctamente.");
      },
    });
  }
};

  // Acción: ir a editar
  const handleEdit = (id: number) => {
    router.get(route("admin.lines.edit", { id }));
  };

  // Acción: ir a crear
  const handleCreate = () => {
    router.get(route("admin.lines.create"));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Administrar Líneas de Gestión</h1>

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
        >
          Crear línea de gestión
        </button>

        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {gestionLines.map((line) => (
              <tr key={line.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{line.id}</td>
                <td className="py-2 px-4 border-b">{line.name}</td>
                <td className="py-2 px-4 border-b">
                <div className="flex items-center gap-5">
                  {/* Editar */}
                  <button
                    onClick={() => handleEdit(line.id)}
                    className="transition transform hover:scale-110"
                    title="Editar"
                  >
                    <Pencil className="h-6 w-6 text-blue-500 hover:text-blue-600" />
                  </button>

                  {/* Borrar */}
                  <button
                    onClick={() => handleDelete(line.id)}
                    className="transition transform hover:scale-110"
                    title="Borrar"
                  >
                    <Trash2 className="h-6 w-6 text-red-600 hover:text-red-700" />
                  </button>
                </div>
              </td>
              </tr>
            ))}

            {gestionLines.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  No hay líneas de gestión registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>

      <Footer />
    </div>
  );
}
