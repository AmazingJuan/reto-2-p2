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
import { ArrowLeft, BriefcaseBusiness } from 'lucide-react';
import { route } from 'ziggy-js';

interface BusinessUnit {
    id: number;
    display_name: string;
    abbreviation: string;
    quotation_seq_year?: number | null;
    quotation_seq_value?: number | null;
}

type EditPageProps = PageProps<{
    viewData: {
        businessUnit: BusinessUnit;
    };
}>;

export default function Edit() {
    const { viewData } = usePage<EditPageProps>().props;
    const { businessUnit } = viewData;

    const { data, setData, put, processing, errors } = useForm({
        display_name: businessUnit.display_name ?? '',
        abbreviation: businessUnit.abbreviation ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('dashboard.business-unit.update', businessUnit.id));
    };

    return (
        <AdminLayout>
            <Head title="Editar unidad de negocio" />

            <div className={adminFormShellClass}>
                <AdminPageHeader
                    icon={BriefcaseBusiness}
                    title="Editar unidad de negocio"
                    description="Modifique el nombre o el abreviado. El correlativo de cotizaciones del año se muestra solo como referencia."
                />

                <div className={adminFormCardClass}>
                    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:space-y-8 sm:p-8">
                        <div>
                            <label htmlFor="display_name" className={adminFieldLabelClass}>
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="display_name"
                                type="text"
                                value={data.display_name}
                                onChange={(e) => setData('display_name', e.target.value)}
                                className={adminFieldInputClass}
                            />
                            {errors.display_name && <p className="mt-2 text-sm text-red-600">{errors.display_name}</p>}
                        </div>

                        <div>
                            <label htmlFor="abbreviation" className={adminFieldLabelClass}>
                                Abreviado <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="abbreviation"
                                type="text"
                                value={data.abbreviation}
                                onChange={(e) => setData('abbreviation', e.target.value.toUpperCase())}
                                className={adminFieldInputClass}
                                maxLength={32}
                            />
                            {errors.abbreviation && <p className="mt-2 text-sm text-red-600">{errors.abbreviation}</p>}
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
                            <p className="font-semibold text-slate-800">Contador de cotizaciones (solo lectura)</p>
                            <p className="mt-1">
                                Año del correlativo:{' '}
                                <span className="font-mono">{businessUnit.quotation_seq_year ?? '—'}</span>
                                {' · '}
                                Último número en ese año:{' '}
                                <span className="font-mono">{businessUnit.quotation_seq_value ?? 0}</span>
                            </p>
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
