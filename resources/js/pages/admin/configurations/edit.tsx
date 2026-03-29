import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

const FIELD_LABELS: Record<string, string> = {
    notification_email: 'Correo de notificaciones',
    application_url: 'URL de la aplicación',
};

function fieldLabel(key: string): string {
    return FIELD_LABELS[key] ?? key.replace(/_/g, ' ');
}

function inputType(key: string): string {
    if (key === 'notification_email') {
        return 'email';
    }
    if (key.endsWith('_url') || key.includes('url')) {
        return 'url';
    }
    return 'text';
}

type EditPageProps = PageProps<{
    viewData: {
        configuration: Record<string, string | null>;
    };
    flash: Record<string, unknown>;
}>;

export default function Edit() {
    const { viewData, flash } = usePage<EditPageProps>().props;
    const configuration = viewData.configuration ?? {};

    const initialData = Object.fromEntries(
        Object.entries(configuration).map(([key, value]) => [key, value ?? '']),
    ) as Record<string, string>;

    const { data, setData, put, processing, errors } = useForm(initialData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('dashboard.configurations.update'));
    };

    const entries = Object.entries(configuration);

    return (
        <AdminLayout>
            <div className="mt-6 mx-auto max-w-4xl px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-3xl">Configuración</h1>
                    <p className="mt-2 text-sm text-gray-600">Ajustes generales del sistema</p>
                </div>

                <FlashAlert flash={flash} />

                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-8 p-8">
                        <div>
                            <div className="grid grid-cols-1 gap-6">
                                {entries.map(([key]) => (
                                    <div key={key}>
                                        <label htmlFor={key} className="mb-2 block text-sm font-medium text-gray-700">
                                            {fieldLabel(key)}
                                        </label>
                                        <input
                                            id={key}
                                            type={inputType(key)}
                                            value={data[key] ?? ''}
                                            onChange={(e) => setData(key, e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            autoComplete="off"
                                        />
                                        {errors[key] && <p className="mt-2 text-sm text-red-600">{errors[key]}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                            <Button type="button" onClick={() => window.history.back()} variant="crear" className="bg-red-600 hover:bg-red-700">
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing} variant="crear" className="bg-amber-600 hover:bg-amber-700">
                                {processing ? 'Guardando...' : 'Guardar configuración'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
