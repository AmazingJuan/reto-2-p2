import {
    AdminPageHeader,
    adminFieldInputClass,
    adminFieldLabelClass,
    adminFormCardClass,
    adminFormShellClass,
    adminOutlineButtonClass,
    adminPrimaryButtonClass,
} from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
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

            <div className={adminFormShellClass}>
                <AdminPageHeader
                    icon={UserCog}
                    title="Editar usuario"
                    description="Modifique los datos y guarde los cambios."
                />

                <div className={adminFormCardClass}>
                    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:space-y-8 sm:p-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="name" className={adminFieldLabelClass}>
                                    Nombre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={adminFieldInputClass}
                                    required
                                />
                                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className={adminFieldLabelClass}>
                                    Correo electrónico <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={adminFieldInputClass}
                                    required
                                />
                                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="phone" className={adminFieldLabelClass}>
                                    Teléfono <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className={adminFieldInputClass}
                                    required
                                />
                                {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="password" className={adminFieldLabelClass}>
                                    Nueva contraseña (opcional)
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={adminFieldInputClass}
                                    placeholder="Dejar en blanco si no desea cambiarla"
                                    autoComplete="new-password"
                                />
                                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end sm:pt-6">
                            <Button
                                type="button"
                                onClick={() => window.history.back()}
                                variant="outline"
                                className={cn(adminOutlineButtonClass, 'w-full sm:w-auto')}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                size="sm"
                                className={cn(adminPrimaryButtonClass, 'w-full sm:w-auto')}
                            >
                                {processing ? 'Guardando...' : 'Guardar cambios'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
