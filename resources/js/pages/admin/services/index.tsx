import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import GoDashboard from '@/components/ui/godashboard';
import { router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';
import AdminLayout from '@/layouts/admin-layout';

interface Service {
    id: number;
    name: string;
}

interface IndexPageProps extends Record<string, unknown> {
    auth: { user: any };
    viewData: {
        services: Service[];
    };
}

export default function Index() {
    const { viewData, flash } = usePage<IndexPageProps & { flash: Record<string, unknown> }>().props;
    const { services } = viewData;
    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    // Acción: borrar servicio
    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que deseas borrar este servicio?')) {
            router.delete(route('dashboard.services.delete', id));
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
            <h1 className="mb-6 text-3xl font-bold text-slate-900">Administrar Servicios</h1>
            <FlashAlert flash={flash} duration={5000} />
            
            <div className="mb-6">
                <Button variant="crear" onClick={handleCreate}>
                    <Plus className="w-4 h-4" /> Crear servicio
                </Button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {services.map((service) => (
                            <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-900">{service.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{capitalize(service.name)}</td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => handleEdit(service.id)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Editar">
                                            <Pencil className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-800 transition-colors" title="Borrar">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {services.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No hay servicios registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
