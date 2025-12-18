import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import Footer from '@/components/ui/footer';
import GoDashboard from '@/components/ui/godashboard';
import Header from '@/components/ui/header';
import { router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

interface BusinessUnit {
    id: number;
    name: string;
}

interface IndexPageProps extends Record<string, unknown> {
    auth: { user: any };
    viewData: {
        businessUnits: BusinessUnit[];
    };
}

export default function Index() {
    const { viewData, flash } = usePage<IndexPageProps & { flash: Record<string, unknown> }>().props;
    const { businessUnits } = viewData;
    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que deseas borrar esta unidad de negocio?')) {
            router.delete(route('dashboard.business-unit.delete', id));
        }
    };

    // Acción: ir a editar
    const handleEdit = (id: number) => {
        router.get(route('dashboard.business-unit.edit', id));
    };

    // Acción: ir a crear
    const handleCreate = () => {
        router.get(route('dashboard.business-unit.create'));
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />
            <GoDashboard />

            <main className="flex-1 p-6">
                <h1 className="mb-6 text-center text-3xl font-bold leading-tight text-slate-900 md:text-3xl">Administrar Unidad de Negocio</h1>

                <FlashAlert flash={flash} duration={5000} />

                <Button onClick={handleCreate} variant="crear" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus />
                    Crear unidad de negocio
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
                        {businessUnits.map((unit) => (
                            <tr
                                key={unit.id}
                                onClick={() => router.get(route('dashboard.business-unit.show', unit.id))}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                <td className="border-b px-4 py-2 text-center">{unit.id}</td>
                                <td className="border-b px-4 py-2 text-center font-medium">{capitalize(unit.name)}</td>

                                <td className="border-b px-4 py-2" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex justify-center gap-5">
                                        <button onClick={() => handleEdit(unit.id)} className="transition hover:scale-110">
                                            <Pencil className="h-6 w-6 text-emerald-600" />
                                        </button>

                                        <button onClick={() => handleDelete(unit.id)} className="transition hover:scale-110">
                                            <Trash2 className="h-6 w-6 text-red-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {businessUnits.length === 0 && (
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
