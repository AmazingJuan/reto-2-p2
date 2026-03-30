import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, UserCircle } from 'lucide-react';
import { route } from 'ziggy-js';

interface GestionLineOpt {
    id: number;
    name: string;
}

type CreateProps = PageProps<{
    gestionLines: GestionLineOpt[];
}>;

export default function Create() {
    const { gestionLines } = usePage<CreateProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        summary: '',
        years_experience: '' as string | number,
        gestion_line_ids: [] as number[],
    });

    const toggleLine = (id: number) => {
        setData(
            'gestion_line_ids',
            data.gestion_line_ids.includes(id) ? data.gestion_line_ids.filter((x) => x !== id) : [...data.gestion_line_ids, id],
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.professionals.store'));
    };

    return (
        <AdminLayout>
            <Head title="Crear profesional" />

            <div className="mx-auto mt-2 w-full min-w-0 max-w-4xl sm:mt-6">
                <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center">
                    <UserCircle className="h-8 w-8 shrink-0 text-blue-600" />
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Crear profesional</h1>
                        <p className="mt-1 text-sm text-slate-600">
                            El nombre y el resumen solo los verá el administrador; el cliente verá Profesional #ID y los años de experiencia. Indique en qué líneas de
                            gestión puede atender.
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-8">
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
                                required
                            />
                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="years_experience" className="mb-2 block text-sm font-medium text-gray-700">
                                Años de experiencia <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="years_experience"
                                type="number"
                                min={0}
                                max={80}
                                value={data.years_experience}
                                onChange={(e) => setData('years_experience', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                className="block w-full max-w-xs rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {errors.years_experience && <p className="mt-2 text-sm text-red-600">{errors.years_experience}</p>}
                        </div>

                        <div>
                            <span className="mb-2 block text-sm font-medium text-gray-700">
                                Líneas de gestión <span className="text-red-500">*</span>
                            </span>
                            <p className="mb-3 text-xs text-gray-500">Solo se ofrecerá este profesional en el cotizador cuando el cliente elija una de estas líneas.</p>
                            <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3">
                                {gestionLines.length === 0 ? (
                                    <p className="text-sm text-gray-500">No hay líneas de gestión en el sistema.</p>
                                ) : (
                                    gestionLines.map((line) => (
                                        <label key={line.id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={data.gestion_line_ids.includes(line.id)}
                                                onChange={() => toggleLine(line.id)}
                                                className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                            />
                                            <span className="text-sm text-gray-800">{line.name}</span>
                                        </label>
                                    ))
                                )}
                            </div>
                            {errors.gestion_line_ids && <p className="mt-2 text-sm text-red-600">{errors.gestion_line_ids}</p>}
                        </div>

                        <div>
                            <label htmlFor="summary" className="mb-2 block text-sm font-medium text-gray-700">
                                Resumen <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="summary"
                                rows={8}
                                value={data.summary}
                                onChange={(e) => setData('summary', e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                placeholder="Descripción del profesional (solo administración)"
                                required
                            />
                            {errors.summary && <p className="mt-2 text-sm text-red-600">{errors.summary}</p>}
                        </div>

                        <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end sm:pt-6">
                            <Button type="button" variant="crear" className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 sm:w-auto" onClick={() => window.history.back()}>
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button type="submit" variant="crear" disabled={processing} className="w-full bg-amber-600 hover:bg-amber-700 sm:w-auto">
                                {processing ? 'Guardando…' : 'Guardar'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
