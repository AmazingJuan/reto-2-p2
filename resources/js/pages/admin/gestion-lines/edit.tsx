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

            <div className={adminFormShellClass}>
                <AdminPageHeader
                    icon={GitBranch}
                    title="Editar línea de gestión"
                    description="Modifique el nombre y guarde los cambios."
                />

                <div className={adminFormCardClass}>
                    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:space-y-8 sm:p-8">
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
                                placeholder="Nombre de la línea de gestión"
                            />
                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
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
