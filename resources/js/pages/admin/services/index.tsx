import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';

interface Service {
    id: number;
    name: string;
}

interface IndexPageProps extends Record<string, unknown> {
    auth: { user: any };
    services: Service[];
}

export default function Index() {
    const { services } = usePage<IndexPageProps>().props;

    // Acción: borrar servicio
    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que deseas borrar este servicio?')) {
            router.delete(route('dashboard.services.delete', id), {
                onSuccess: () => {
                    alert('Servicio borrado correctamente.');
                },
            });
        }
    };

    // Acción: ir a editar
    const handleEdit = (id: number) => {
        router.get(route('dashboard.services.edit', id));
    };

    // Acción: ir a crear
    const handleCreate = () => {
        router.get(route('dashboard.services.create'));
    };

        return (
            <AdminLayout>
                <div className="p-6">
                        <h1 className="mb-6 text-center text-3xl font-bold leading-tight text-slate-900 md:text-3xl">Administrar Servicios</h1>

                        <Button variant="crear" onClick={handleCreate}>
                                <Plus /> Crear servicio
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
                        {services.map((service) => (
                            <tr key={service.id} className="hover:bg-gray-50">
                                <td className="flex justify-center border-b px-4 py-2">{service.id}</td>
                                <td className="border-b px-4 py-2 text-center">{service.name}</td>

                                <td className="border-b px-4 py-2">
                                    <div className="flex items-center justify-center gap-5">
                                        {/* Editar */}
                                        <button
                                            onClick={() => handleEdit(service.id)}
                                            className="transform transition hover:scale-110"
                                            title="Editar"
                                        >
                                            <Pencil className="h-6 w-6 text-blue-500 hover:text-blue-600" />

                                        </button>

                                        {/* Borrar */}
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="transform transition hover:scale-110"
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
                                <td colSpan={4} className="py-4 text-center">
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
