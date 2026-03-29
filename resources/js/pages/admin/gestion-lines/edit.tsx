import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, GitBranch } from 'lucide-react';
import { route } from 'ziggy-js';

interface GestionLine {
    id: number;
    name: string;
}

type EditPageProps = PageProps<{
    gestionLine: GestionLine;
}>;

export default function Edit() {
    const { gestionLine } = usePage<EditPageProps>().props;

    const { data, setData, put, processing, errors } = useForm({
        name: gestionLine.name || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('dashboard.lines.update', { id: gestionLine.id }));
    };

    return (
        <AdminLayout>
            <Head title="Editar línea de gestión" />

            <div className="mx-auto mt-6 max-w-4xl px-4">
                <div className="mb-8 flex items-center gap-3">
                    <GitBranch className="h-8 w-8 text-blue-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Editar línea de gestión</h1>
                        <p className="mt-1 text-sm text-gray-600">Modifique el nombre y guarde los cambios.</p>
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
                                placeholder="Nombre de la línea de gestión"
                            />
                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                            <Button type="button" onClick={() => window.history.back()} variant="crear" className="bg-red-600 hover:bg-red-700">
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing} variant="crear" className="bg-amber-600 hover:bg-amber-700">
                                {processing ? 'Guardando...' : 'Guardar cambios'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
