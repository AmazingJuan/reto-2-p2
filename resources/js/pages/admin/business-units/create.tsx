import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, BriefcaseBusiness } from 'lucide-react';
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
            <Head title="Crear unidad de negocio" />

            <div className="mx-auto mt-2 w-full min-w-0 max-w-4xl sm:mt-6">
                <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center">
                    <BriefcaseBusiness className="h-8 w-8 shrink-0 text-blue-600" />
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Crear unidad de negocio</h1>
                        <p className="mt-1 text-sm text-gray-600">Indique el nombre visible de la nueva unidad.</p>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:space-y-8 sm:p-8">
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
                                placeholder="Nombre de la unidad de negocio"
                            />
                            {errors.display_name && <p className="mt-2 text-sm text-red-600">{errors.display_name}</p>}
                        </div>

                        <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end sm:pt-6">
                            <Button
                                type="button"
                                onClick={() => window.history.back()}
                                variant="crear"
                                className="w-full bg-red-600 hover:bg-red-700 sm:w-auto"
                            >
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                variant="crear"
                                className="w-full bg-amber-600 hover:bg-amber-700 sm:w-auto"
                            >
                                {processing ? 'Creando...' : 'Crear unidad'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
