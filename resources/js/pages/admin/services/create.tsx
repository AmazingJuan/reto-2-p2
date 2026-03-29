import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Wrench } from 'lucide-react';
import { route } from 'ziggy-js';

interface BusinessUnitOption {
    id: number | string;
    display_name: string;
}

interface GestionLineOption {
    id: number | string;
    name: string;
}

type CreatePageProps = PageProps<{
    businessUnits: BusinessUnitOption[];
    gestionLines: GestionLineOption[];
}>;

export default function Create() {
    const { businessUnits, gestionLines } = usePage<CreatePageProps>().props;
    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        business_unit_id: '',
        gestion_line_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.services.store'));
    };

    return (
        <AdminLayout>
            <Head title="Crear servicio" />

            <div className="mx-auto mt-6 max-w-4xl px-4">
                <div className="mb-8 flex items-center gap-3">
                    <Wrench className="h-8 w-8 text-blue-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Crear servicio</h1>
                        <p className="mt-1 text-sm text-gray-600">Nombre, unidad de negocio y línea de gestión.</p>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-8 p-8">
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                placeholder="Nombre del servicio"
                            />
                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-medium text-gray-900">Clasificación</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="business_unit_id" className="mb-2 block text-sm font-medium text-gray-700">
                                        Unidad de negocio <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="business_unit_id"
                                        value={data.business_unit_id}
                                        onChange={(e) => setData('business_unit_id', e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccione</option>
                                        {businessUnits.map((u) => (
                                            <option key={String(u.id)} value={String(u.id)}>
                                                {capitalize(u.display_name)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.business_unit_id && (
                                        <p className="mt-2 text-sm text-red-600">{errors.business_unit_id}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="gestion_line_id" className="mb-2 block text-sm font-medium text-gray-700">
                                        Línea de gestión <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="gestion_line_id"
                                        value={data.gestion_line_id}
                                        onChange={(e) => setData('gestion_line_id', e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccione</option>
                                        {gestionLines.map((line) => (
                                            <option key={String(line.id)} value={String(line.id)}>
                                                {capitalize(line.name)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.gestion_line_id && (
                                        <p className="mt-2 text-sm text-red-600">{errors.gestion_line_id}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                            <Button type="button" onClick={() => window.history.back()} variant="crear" className="bg-red-600 hover:bg-red-700">
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing} variant="crear" className="bg-amber-600 hover:bg-amber-700">
                                {processing ? 'Guardando...' : 'Guardar servicio'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
