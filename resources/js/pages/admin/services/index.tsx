import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import { router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';
import AdminLayout from '@/layouts/admin-layout';
import { useState } from 'react';

interface Service {
    id: number;
    name: string;
    business_unit_id: number;
}

interface BusinessUnit {
    id: string;
    display_name: string;
}

interface IndexPageProps extends Record<string, unknown> {
    auth: { user: any };
    viewData: {
        services: Service[];
        businessUnits: BusinessUnit[];
    };
}

export default function Index() {
    const { viewData, flash } = usePage<IndexPageProps & { flash: Record<string, unknown> }>().props;
    const { services, businessUnits } = viewData;
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<string>('all');
    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    const filteredServices = selectedBusinessUnit === 'all' 
        ? services 
        : services.filter(service => service.business_unit_id === parseInt(selectedBusinessUnit));

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
                        <div className="p-6">
                <h1 className="mb-6 text-center text-3xl font-bold leading-tight text-slate-900 md:text-3xl">Administrar Servicios</h1>
                <FlashAlert flash={flash} duration={5000} />
                <div className="mb-4 flex items-center justify-between">
                    <Button variant="crear" onClick={handleCreate}>
                        <Plus /> Crear servicio
                    </Button>
                    <div className="flex items-center gap-2">
                        <label htmlFor="business-unit-filter" className="text-sm font-medium text-gray-700">
                            Filtrar por Unidad de Negocio:
                        </label>
                        <select
                            id="business-unit-filter"
                            value={selectedBusinessUnit}
                            onChange={(e) => setSelectedBusinessUnit(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todas</option>
                            {businessUnits.map((unit) => (
                                <option key={unit.id} value={unit.id}>
                                    {unit.display_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <table className="min-w-full rounded-lg border bg-white shadow">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border-b px-4 py-2">ID</th>
                            <th className="border-b px-4 py-2">Nombre</th>
                            <th className="border-b px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredServices.map((service) => (
                            <tr key={service.id} className="hover:bg-gray-50">
                                <td className="flex justify-center border-b px-4 py-2">{service.id}</td>
                                <td className="border-b px-4 py-2 text-center">{capitalize(service.name)}</td>

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

                        {filteredServices.length === 0 && (
                            <tr>
                                <td colSpan={3} className="py-4 text-center">
                                    {selectedBusinessUnit === 'all' ? 'No hay servicios registrados.' : 'No hay servicios para la unidad de negocio seleccionada.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                        </div>
                </AdminLayout>
    );
}
