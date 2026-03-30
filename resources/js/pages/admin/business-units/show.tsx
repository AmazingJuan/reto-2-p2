import {
    AdminPageHeader,
    adminListShellClass,
    adminOutlineButtonClass,
    adminTableCardClass,
    adminTableTdClass,
    adminTableThClass,
} from '@/components/admin/admin-page-header';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, BriefcaseBusiness } from 'lucide-react';
import { route } from 'ziggy-js';

interface BusinessUnit {
    id: number;
    display_name: string;
    abbreviation: string;
    quotation_seq_year?: number | null;
    quotation_seq_value?: number | null;
}

interface Service {
    id: number;
    name: string;
}

type ShowPageProps = PageProps<{
    viewData: {
        businessUnit: BusinessUnit;
        services: Service[];
    };
}>;

export default function Show() {
    const { viewData } = usePage<ShowPageProps>().props;
    const { businessUnit, services } = viewData;
    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    return (
        <AdminLayout>
            <div className={adminListShellClass}>
                <Link
                    href={route('dashboard.business-unit.index')}
                    className={cn(
                        adminOutlineButtonClass,
                        'mb-2 inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm sm:mb-0 sm:w-auto',
                    )}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al listado
                </Link>

                <AdminPageHeader
                    icon={BriefcaseBusiness}
                    title={capitalize(businessUnit.display_name)}
                    description={`Abreviado ${businessUnit.abbreviation} · ID #${businessUnit.id}`}
                />

                <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
                    <p>
                        <span className="font-semibold text-slate-900">Contador de cotizaciones (año actual):</span>{' '}
                        {businessUnit.quotation_seq_year != null
                            ? `’${String(businessUnit.quotation_seq_year).padStart(2, '0')} · último n.º ${businessUnit.quotation_seq_value ?? 0}`
                            : 'Aún sin cotizaciones registradas.'}
                    </p>
                </div>

                <div className={adminTableCardClass}>
                    <table className="min-w-[360px] w-full divide-y divide-slate-200 sm:min-w-full">
                        <thead className="border-b border-slate-100 bg-slate-50/50">
                            <tr>
                                <th className={adminTableThClass}>ID</th>
                                <th className={adminTableThClass}>Nombre</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {services.length > 0 ? (
                                services.map((service) => (
                                    <tr key={service.id} className="transition hover:bg-slate-50/80">
                                        <td className={adminTableTdClass}>{service.id}</td>
                                        <td className={adminTableTdClass}>{service.name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
                                        Esta unidad no tiene servicios asociados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
