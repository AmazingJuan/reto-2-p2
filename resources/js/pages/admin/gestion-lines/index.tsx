import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
import { router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';

interface GestionLine {
    id: number;
    name: string;
}

interface IndexPageProps extends Record<string, unknown> {
    auth: { user: any };
    viewData: {
        gestionLines: GestionLine[];
    };
}

export default function Index() {
    const { viewData, flash } = usePage<IndexPageProps & { flash: Record<string, unknown> }>().props;
    const { gestionLines } = viewData;
    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que deseas borrar esta línea de gestión?')) {
            router.delete(route('dashboard.lines.delete', id));
        }
    };

    const handleEdit = (id: number) => {
        router.get(route('dashboard.lines.edit', { id }));
    };

    const handleCreate = () => {
        router.get(route('dashboard.lines.create'));
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="mb-6 text-center text-3xl font-bold leading-tight text-slate-900 md:text-3xl">Administrar Líneas de Gestión</h1>
                <FlashAlert flash={flash}/>
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
                                <td className="border-b px-4 py-2 text-center">{capitalize(line.name)}</td>
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
            </div>
        </AdminLayout>
    );
}
