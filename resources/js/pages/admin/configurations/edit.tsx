import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Settings } from 'lucide-react';
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
}>;

export default function Edit() {
    const { viewData, flash } = usePage<EditPageProps & { flash: Record<string, unknown> }>().props;
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
            <Head title="Configuración" />

            <div className="mx-auto mt-2 w-full min-w-0 max-w-4xl sm:mt-6">
                <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center">
                    <Settings className="h-8 w-8 shrink-0 text-blue-600" />
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Configuración</h1>
                        <p className="mt-1 text-sm text-gray-600">Ajustes generales del sistema</p>
                    </div>
                </div>

                <FlashAlert flash={flash} />

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:space-y-8 sm:p-8">
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
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            autoComplete="off"
                                        />
                                        {errors[key] && <p className="mt-2 text-sm text-red-600">{errors[key]}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end sm:pt-6">
                            <Button
                                type="button"
                                onClick={() => window.history.back()}
                                variant="crear"
                                className="w-full bg-red-600 hover:bg-red-700 sm:w-auto"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                variant="crear"
                                className="w-full bg-amber-600 hover:bg-amber-700 sm:w-auto"
                            >
                                {processing ? 'Guardando...' : 'Guardar configuración'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
