import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, BriefcaseBusiness } from 'lucide-react';
import { route } from 'ziggy-js';

interface BusinessUnit {
    id: number;
    display_name: string;
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
            <div className="w-full min-w-0 space-y-6">
                <div className="mx-auto w-full min-w-0 max-w-6xl">
                    <Link
                        href={route('dashboard.business-unit.index')}
                        className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-gray-50 sm:mb-6 sm:w-auto sm:justify-start"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al listado
                    </Link>

                    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center">
                        <BriefcaseBusiness className="h-8 w-8 shrink-0 text-blue-600" />
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{capitalize(businessUnit.display_name)}</h1>
                            <p className="mt-1 text-sm text-gray-600">Servicios asociados a esta unidad · ID #{businessUnit.id}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm [-webkit-overflow-scrolling:touch]">
                        <table className="min-w-[360px] w-full divide-y divide-gray-200 sm:min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">ID</th>
                                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 sm:py-3">Nombre</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {services.length > 0 ? (
                                    services.map((service) => (
                                        <tr key={service.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{service.id}</td>
                                            <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4">{service.name}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="px-4 py-6 text-center text-gray-500 sm:px-6">
                                            Esta unidad no tiene servicios asociados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
