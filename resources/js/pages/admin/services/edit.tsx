import {
    AdminPageHeader,
    adminFieldInputClass,
    adminFieldLabelClass,
    adminFormCardClass,
    adminFormSectionTitleClass,
    adminFormShellClass,
    adminOutlineButtonClass,
    adminPrimaryButtonClass,
    adminSelectFieldClass,
} from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Wrench } from 'lucide-react';
import { route } from 'ziggy-js';

interface Service {
    id: number;
    name: string;
    business_unit_id: number | string;
    gestion_line_id: number | string;
}

interface BusinessUnitOption {
    id: number | string;
    display_name: string;
}

interface GestionLineOption {
    id: number | string;
    name: string;
}

type EditPageProps = PageProps<{
    service: Service;
    businessUnits: BusinessUnitOption[];
    gestionLines: GestionLineOption[];
}>;

export default function Edit() {
    const { service, businessUnits, gestionLines } = usePage<EditPageProps>().props;

    const { data, setData, put, processing, errors } = useForm({
        name: service.name || '',
        business_unit_id: String(service.business_unit_id ?? ''),
        gestion_line_id: String(service.gestion_line_id ?? ''),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('dashboard.services.update', service.id));
    };

    return (
        <AdminLayout>
            <Head title="Editar servicio" />

            <div className={adminFormShellClass}>
                <AdminPageHeader icon={Wrench} title="Editar servicio" description="Actualice los datos del servicio." />

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
                            />
                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <h2 className={adminFormSectionTitleClass}>Clasificación</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="business_unit_id" className={adminFieldLabelClass}>
                                        Unidad de negocio <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="business_unit_id"
                                        value={data.business_unit_id}
                                        onChange={(e) => setData('business_unit_id', e.target.value)}
                                        className={adminSelectFieldClass}
                                    >
                                        <option value="">Seleccione</option>
                                        {businessUnits.map((u) => (
                                            <option key={String(u.id)} value={String(u.id)}>
                                                {u.display_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.business_unit_id && (
                                        <p className="mt-2 text-sm text-red-600">{errors.business_unit_id}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="gestion_line_id" className={adminFieldLabelClass}>
                                        Línea de gestión <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="gestion_line_id"
                                        value={data.gestion_line_id}
                                        onChange={(e) => setData('gestion_line_id', e.target.value)}
                                        className={adminSelectFieldClass}
                                    >
                                        <option value="">Seleccione</option>
                                        {gestionLines.map((line) => (
                                            <option key={String(line.id)} value={String(line.id)}>
                                                {line.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.gestion_line_id && (
                                        <p className="mt-2 text-sm text-red-600">{errors.gestion_line_id}</p>
                                    )}
                                </div>
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
