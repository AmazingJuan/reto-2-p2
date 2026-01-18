import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.lines.store'));
    };

    return (
        <AdminLayout>
            <div className="mt-6 mx-auto max-w-4xl px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-3xl">Crear Línea de Gestión</h1>
                        <p className="mt-2 text-sm text-gray-600">Complete el siguiente campo para crear una nueva línea de gestión</p>
                    </div>

                    {/* Form Card */}
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-8 p-8">
                            {/* Información básica */}
                            <div>
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Nombre */}
                                    <div>
                                        <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                                            Nombre <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            placeholder="Ingrese el nombre de la línea de gestión"
                                        />
                                        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                                <Button type="button" onClick={() => window.history.back()} variant="crear" className="bg-red-600 hover:bg-red-700">
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={processing} variant="crear" className="bg-amber-600 hover:bg-amber-700">
                                    {processing ? 'Creando...' : 'Crear Línea de Gestión'}
                                </Button>
                            </div>
                        </form>
                    </div>
            </div>
        </AdminLayout>
    );
}
