import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { route } from 'ziggy-js';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.users.store'));
    };

    return (
        <AdminLayout>
            <Head title="Crear usuario" />

            <div className="mx-auto mt-2 w-full min-w-0 max-w-4xl sm:mt-6">
                <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center">
                    <UserPlus className="h-8 w-8 shrink-0 text-blue-600" />
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Crear usuario</h1>
                        <p className="mt-1 text-sm text-gray-600">Complete los campos para registrar un nuevo usuario.</p>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:space-y-8 sm:p-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                    placeholder="Ej: Juan Pérez"
                                    required
                                />
                                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                                    Correo electrónico <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    placeholder="correo@ejemplo.com"
                                    required
                                />
                                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                                    Teléfono <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: 3001234567"
                                    required
                                />
                                {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                                    Contraseña <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Mínimo 8 caracteres"
                                    required
                                    autoComplete="new-password"
                                />
                                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                            </div>
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
                                {processing ? 'Guardando...' : 'Guardar usuario'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
