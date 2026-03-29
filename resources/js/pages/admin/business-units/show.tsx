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
            <div className="p-6">
                <div className="mx-auto mb-6 max-w-6xl">
                    <Link
                        href={route('dashboard.business-unit.index')}
                        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-gray-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al listado
                    </Link>

                    <div className="mb-8 flex items-center gap-3">
                        <BriefcaseBusiness className="h-8 w-8 text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">{capitalize(businessUnit.display_name)}</h1>
                            <p className="mt-1 text-sm text-gray-600">Servicios asociados a esta unidad · ID #{businessUnit.id}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nombre</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {services.length > 0 ? (
                                    services.map((service) => (
                                        <tr key={service.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">{service.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{service.name}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-6 text-center text-gray-500">
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
