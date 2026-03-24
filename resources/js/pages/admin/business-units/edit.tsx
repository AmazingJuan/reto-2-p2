import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { router, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface BusinessUnit {
    id: number;
    display_name: string;
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
        display_name: businessUnit.display_name ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('dashboard.business-unit.update', businessUnit.id));
    };

    const handleCancel = () => {
        router.get(route('dashboard.business-unit.index'));
    };

    return (
        <AdminLayout>
            <div className="p-6">
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
                                    value={data.display_name}
                                    onChange={(e) => setData('display_name', e.target.value)}
                                    className="block w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.display_name && <p className="mt-2 text-sm text-red-600">{errors.display_name}</p>}
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end gap-3 border-t pt-6">
                                <Button type = "button" variant="training" onClick={handleCancel} className="bg-red-600 hover:bg-red-700">
                                    Cancelar
                                </Button>
                                <Button variant="training" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                                    {processing ? 'Actualizando...' : 'Actualizar Unidad de Negocio'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
