import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, UserCog } from 'lucide-react';
import { route } from 'ziggy-js';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
}

type EditPageProps = PageProps<{
    viewData: {
        user: User;
    };
}>;

export default function Edit() {
    const { viewData } = usePage<EditPageProps>().props;
    const { user } = viewData;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('dashboard.users.update', user.id));
    };

    return (
        <AdminLayout>
            <Head title="Editar usuario" />

            <div className="mx-auto mt-6 max-w-4xl px-4">
                <div className="mb-8 flex items-center gap-3">
                    <UserCog className="h-8 w-8 text-blue-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Editar usuario</h1>
                        <p className="mt-1 text-sm text-gray-600">Modifique los datos y guarde los cambios.</p>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-8 p-8">
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
                                    required
                                />
                                {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                                    Nueva contraseña (opcional)
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Dejar en blanco si no desea cambiarla"
                                    autoComplete="new-password"
                                />
                                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                            </div>
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
