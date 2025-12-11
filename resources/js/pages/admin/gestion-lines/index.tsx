import { Button } from '@/components/ui/button';
import Footer from '@/components/ui/footer';
import GoDashboard from '@/components/ui/godashboard';
import Header from '@/components/ui/header';
import { router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';

interface GestionLine {
    id: number;
    name: string;
}

interface IndexPageProps extends Record<string, unknown> {
    auth: { user: any };
    gestionLines: GestionLine[];
}

export default function Index() {
    const { gestionLines } = usePage<IndexPageProps>().props;

    // Acción: borrar línea de gestión
    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que deseas borrar esta línea de gestión?')) {
            router.delete(route('dashboard.lines.delete', id), {
                onSuccess: () => {
                    alert('Linea de gestión borrada correctamente.');
                },
            });
        }
    };

    // Acción: ir a editar
    const handleEdit = (id: number) => {
        router.get(route('dashboard.lines.edit', { id }));
    };

    // Acción: ir a crear
    const handleCreate = () => {
        router.get(route('dashboard.lines.create'));
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />
            <GoDashboard />

            <main className="flex-1 p-6">
                <h1 className="mb-6 text-center text-3xl font-bold leading-tight text-slate-900 md:text-3xl">Administrar Líneas de Gestión</h1>

                <Button onClick={handleCreate} variant="crear" className="bg-amber-600 hover:bg-amber-600">
                    <Plus />
                    Crear línea de gestión
                </Button>

                <table className="min-w-full rounded-lg border bg-white shadow">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border-b px-4 py-2">ID</th>
                            <th className="border-b px-4 py-2">Nombre</th>
                            <th className="border-b px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gestionLines.map((line) => (
                            <tr key={line.id} className="hover:bg-gray-50">
                                <td className="flex justify-center border-b px-4 py-2">{line.id}</td>
                                <td className="border-b px-4 py-2 text-center">{line.name}</td>
                                <td className="border-b px-4 py-2">
                                    <div className="flex items-center justify-center gap-5">
                                        {/* Editar */}
                                        <button onClick={() => handleEdit(line.id)} className="transform transition hover:scale-110" title="Editar">
                                            <Pencil className="h-6 w-6 text-amber-500 hover:text-amber-600" />
                                        </button>

                                        {/* Borrar */}
                                        <button onClick={() => handleDelete(line.id)} className="transform transition hover:scale-110" title="Borrar">
                                            <Trash2 className="h-6 w-6 text-red-600 hover:text-red-700" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {gestionLines.length === 0 && (
                            <tr>
                                <td colSpan={3} className="py-4 text-center">
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
