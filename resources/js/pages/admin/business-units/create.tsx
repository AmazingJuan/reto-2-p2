import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        display_name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.business-unit.store'));
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">Crear Unidad de Negocio</h1>
                        <p className="mt-2 text-sm text-gray-600">Complete el siguiente campo para crear una nueva unidad de negocio</p>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-8 p-8">
                            <div>
                                <label htmlFor="display_name" className="mb-2 block text-sm font-medium text-gray-700">
                                    Nombre <span className="text-red-500">*</span>
                                </label>

                                <input
                                    id="display_name"
                                    type="text"
                                    value={data.display_name}
                                    onChange={(e) => setData('display_name', e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ingrese el nombre de la unidad de negocio"
                                />

                                {errors.display_name && <p className="mt-2 text-sm text-red-600">{errors.display_name}</p>}
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                                <Button variant="training" onClick={() => window.history.back()} className="bg-red-600 hover:bg-red-700">
                                    Cancelar
                                </Button>

                                <Button variant="training" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                                    {processing ? 'Creando...' : 'Crear Unidad de Negocio'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
