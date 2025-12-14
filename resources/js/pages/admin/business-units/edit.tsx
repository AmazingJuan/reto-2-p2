import { Button } from '@/components/ui/button';
import Footer from '@/components/ui/footer';
import GoDashboard from '@/components/ui/godashboard';
import Header from '@/components/ui/header';
import { useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface BusinessUnit {
    id: number;
    name: string;
}

interface EditPageProps extends Record<string, unknown> {
    auth: { user: any };
    viewData: {
        businessUnit: BusinessUnit;
    };
}

export default function Edit() {
    const { viewData } = usePage<EditPageProps>().props;
    const { businessUnit } = viewData;

    const { data, setData, put, processing, errors } = useForm({
        name: businessUnit.name ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('dashboard.business-unit.update', businessUnit.id));
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />
            <GoDashboard />

            <main className="flex-grow px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">Editar Unidad de Negocio</h1>
                        <p className="mt-2 text-sm text-gray-600">Modifique el campo necesario para actualizar la unidad de negocio</p>
                    </div>

                    <div className="rounded-lg border bg-white shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-8 p-8">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Nombre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="block w-full rounded-lg border px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                />
                                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end gap-3 border-t pt-6">
                                <Button variant="training" onClick={() => window.history.back()} className="bg-red-600 hover:bg-red-700">
                                    Cancelar
                                </Button>
                                <Button variant="training" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                                    {processing ? 'Actualizando...' : 'Actualizar Unidad de Negocio'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
