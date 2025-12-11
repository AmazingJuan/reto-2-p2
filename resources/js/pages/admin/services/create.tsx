import { useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Footer from '../../../components/admin/footer';
import Header from '../../../components/admin/header';

interface businessUnit {
    id: string;
    name: string;
}

interface GestionLine {
    id: number;
    name: string;
}

interface CreatePageProps extends Record<string, unknown> {
    auth: { user: any };
    businessUnits: businessUnit[];
    gestionLines: GestionLine[];
}

export default function Create() {
    const { businessUnits, gestionLines } = usePage<CreatePageProps>().props;

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
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />

            <main className="flex-grow px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-gray-900">Crear Servicio</h1>
                        <p className="mt-2 text-sm text-gray-600">Complete los siguientes campos para crear un nuevo servicio</p>
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
                                            placeholder="Ingrese el nombre del servicio"
                                        />
                                        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                                    </div>
                                    
                                </div>
                            </div>

                            {/* Clasificación */}
                            <div>
                                <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-medium text-gray-900">Clasificación</h2>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Tipo de servicio */}
                                    <div>
                                        <label htmlFor="business_unit_id" className="mb-2 block text-sm font-medium text-gray-700">
                                            Unidad de negocio <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="business_unit_id"
                                            value={data.business_unit_id}
                                            onChange={(e) => setData('business_unit_id', e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Seleccione unidad de negocio</option>
                                            {businessUnits.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.business_unit_id && <p className="mt-2 text-sm text-red-600">{errors.business_unit_id}</p>}
                                    </div>

                                    {/* Línea de gestión */}
                                    <div>
                                        <label htmlFor="gestion_line_id" className="mb-2 block text-sm font-medium text-gray-700">
                                            Línea de Gestión <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="gestion_line_id"
                                            value={data.gestion_line_id}
                                            onChange={(e) => setData('gestion_line_id', e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Seleccione una línea</option>
                                            {gestionLines.map((line) => (
                                                <option key={line.id} value={line.id}>
                                                    {line.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.gestion_line_id && <p className="mt-2 text-sm text-red-600">{errors.gestion_line_id}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg border border-transparent bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Servicio'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
