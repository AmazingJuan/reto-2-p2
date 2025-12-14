import { Button } from '@/components/ui/button';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface BusinessUnit {
    id: number;
    name: string;
}

interface Service {
    id: number;
    name: string;
}

interface ShowPageProps extends Record<string, unknown> {
    auth: { user: any };
    viewData: {
        businessUnit: BusinessUnit;
        services: Service[];
    };
}

export default function Show() {
    const { viewData } = usePage<ShowPageProps>().props;
    const { businessUnit, services } = viewData;
    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />
            <div className="ml-5 mt-24">
                <Link href={'/dashboard/unidad-negocio'}>
                    <Button variant="outline" className="flex items-center gap-2">
                        <ArrowLeft />
                        {'Volver'}
                    </Button>
                </Link>
            </div>

            <main className="flex-1 p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Unidad de Negocio</h1>
                    </div>
                </div>

                <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-800">{capitalize(businessUnit.name)}</h2>
                        </div>

                        <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">ID #{businessUnit.id}</div>
                    </div>
                </div>

                <p className="mb-5 mt-1 text-sm text-gray-600">
                    Servicios asociados a la unidad <strong>{businessUnit.name}</strong>
                </p>

                <div className="rounded-lg border bg-white shadow">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border-b px-4 py-2 text-center">ID</th>
                                <th className="border-b px-4 py-2 text-center">Nombre</th>
                            </tr>
                        </thead>

                        <tbody>
                            {services.map((service) => (
                                <tr key={service.id} className="hover:bg-gray-50">
                                    <td className="border-b px-4 py-2 text-center">{service.id}</td>
                                    <td className="border-b px-4 py-2 text-center">{service.name}</td>
                                </tr>
                            ))}

                            {services.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="py-6 text-center text-gray-500">
                                        Esta unidad de negocio no tiene servicios asociados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            <Footer />
        </div>
    );
}
