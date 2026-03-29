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

            <div className={adminFormShellClass}>
                <AdminPageHeader
                    icon={UserPlus}
                    title="Crear usuario"
                    description="Complete los campos para registrar un nuevo usuario."
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
                                    placeholder="Ej: Juan Pérez"
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
                                    placeholder="correo@ejemplo.com"
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
                                    placeholder="Ej: 3001234567"
                                    required
                                />
                                {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="password" className={adminFieldLabelClass}>
                                    Contraseña <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={adminFieldInputClass}
                                    placeholder="Mínimo 8 caracteres"
                                    required
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
                                {processing ? 'Guardando...' : 'Guardar usuario'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
