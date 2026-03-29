import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Download, ScrollText, Upload } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

interface QuotationOrder {
    id: number | string;
    contact_info?: {
        name: string;
        email: string;
        company?: string | null;
        phone?: string;
        role?: string;
    };
    business_unit?: string;
    gestion_line?: string;
    services?: string[];
    answers?: Record<string, unknown>;
    is_generated: boolean;
    quotation_url?: string;
    created_at?: string;
    updated_at?: string;
}

type ShowPageProps = PageProps<{
    viewData: {
        quotationOrder: QuotationOrder;
    };
}>;

export default function Show() {
    const { viewData, errors, flash } = usePage<ShowPageProps & { flash: Record<string, unknown> }>().props;
    const { quotationOrder } = viewData;
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [quotationUrl, setQuotationUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleUpload = () => {
        if (!quotationUrl.trim()) return;

        setUploading(true);
        router.post(
            route('dashboard.quotation-orders.upload-quotation-url', quotationOrder.id),
            { quotation_url: quotationUrl },
            {
                onSuccess: () => {
                    setShowUploadModal(false);
                    setQuotationUrl('');
                },
                onFinish: () => {
                    setUploading(false);
                },
            },
        );
    };

    if (!quotationOrder) {
        return (
            <AdminLayout>
                <div className="p-6 text-center text-gray-500">No se encontró la cotización.</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Head title={`Cotización #${quotationOrder.id}`} />

            <div className="mx-auto max-w-6xl p-6">
                <FlashAlert flash={flash} />

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link
                            href={route('dashboard.quotation-orders.index')}
                            className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Volver
                        </Link>
                        <div className="flex items-center gap-3">
                            <ScrollText className="h-8 w-8 text-blue-600" />
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">Cotización #{quotationOrder.id}</h1>
                                <p className="mt-1 text-sm text-gray-600">Detalle de la solicitud</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {!quotationOrder.is_generated ? (
                            <Button
                                type="button"
                                onClick={() => setShowUploadModal(true)}
                                variant="crear"
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                <Upload className="mr-2 h-5 w-5" />
                                Subir propuesta
                            </Button>
                        ) : quotationOrder.quotation_url ? (
                            <a
                                href={quotationOrder.quotation_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                            >
                                <Download className="mr-2 h-5 w-5" />
                                Descargar PDF
                            </a>
                        ) : null}
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <table className="w-full">
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                                <td className="w-1/3 px-6 py-4 font-semibold text-gray-600">ID</td>
                                <td className="px-6 py-4 text-gray-900">{quotationOrder.id}</td>
                            </tr>

                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-semibold text-gray-600">Estado</td>
                                <td className="px-6 py-4">
                                    {quotationOrder.is_generated ? (
                                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                            Generada
                                        </span>
                                    ) : (
                                        <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                                            Pendiente
                                        </span>
                                    )}
                                </td>
                            </tr>

                            {quotationOrder.contact_info && (
                                <>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold text-gray-600">Nombre</td>
                                        <td className="px-6 py-4 text-gray-900">{quotationOrder.contact_info.name}</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold text-gray-600">Email</td>
                                        <td className="px-6 py-4 text-gray-900">{quotationOrder.contact_info.email}</td>
                                    </tr>
                                    {quotationOrder.contact_info.company && (
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-semibold text-gray-600">Empresa</td>
                                            <td className="px-6 py-4 text-gray-900">{quotationOrder.contact_info.company}</td>
                                        </tr>
                                    )}
                                    {quotationOrder.contact_info.phone && (
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-semibold text-gray-600">Teléfono</td>
                                            <td className="px-6 py-4 text-gray-900">{quotationOrder.contact_info.phone}</td>
                                        </tr>
                                    )}
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold text-gray-600">Cargo</td>
                                        <td className="px-6 py-4 text-gray-900">{quotationOrder.contact_info.role}</td>
                                    </tr>
                                </>
                            )}

                            {quotationOrder.business_unit && (
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold text-gray-600">Unidad de negocio</td>
                                    <td className="px-6 py-4 text-gray-900">{quotationOrder.business_unit}</td>
                                </tr>
                            )}

                            {quotationOrder.gestion_line && (
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold text-gray-600">Línea de gestión</td>
                                    <td className="px-6 py-4 text-gray-900">{quotationOrder.gestion_line}</td>
                                </tr>
                            )}

                            {quotationOrder.services && quotationOrder.services.length > 0 && (
                                <tr className="align-top hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold text-gray-600">Servicios</td>
                                    <td className="px-6 py-4">
                                        <ul className="list-inside list-disc space-y-1 text-gray-900">
                                            {quotationOrder.services.map((service, idx) => (
                                                <li key={idx}>{service}</li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            )}

                            {quotationOrder.answers && Object.keys(quotationOrder.answers).length > 0 && (
                                <tr className="align-top hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold text-gray-600">Respuestas</td>
                                    <td className="px-6 py-4">
                                        <ul className="list-inside list-disc space-y-1 text-gray-900">
                                            {Object.entries(quotationOrder.answers).map(([key, value]) => (
                                                <li key={key}>
                                                    <span className="font-medium">{key}:</span> {String(value)}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            )}

                            {quotationOrder.created_at && (
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold text-gray-600">Fecha de creación</td>
                                    <td className="px-6 py-4 text-gray-900">
                                        {new Date(quotationOrder.created_at).toLocaleDateString('es-CO')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40"
                        aria-label="Cerrar"
                        onClick={() => setShowUploadModal(false)}
                    />
                    <div className="relative z-10 w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
                        <h3 className="mb-4 text-xl font-bold text-gray-900">Subir enlace de propuesta</h3>

                        <div className="mb-4">
                            <label htmlFor="quotation_url" className="mb-2 block text-sm font-medium text-gray-700">
                                URL de la propuesta
                            </label>
                            <input
                                id="quotation_url"
                                type="url"
                                value={quotationUrl}
                                onChange={(e) => setQuotationUrl(e.target.value)}
                                placeholder="https://ejemplo.com/propuesta.pdf"
                                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                                    errors.quotation_url
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                            />
                            {errors.quotation_url && <p className="mt-1 text-sm text-red-600">{errors.quotation_url}</p>}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="crear"
                                onClick={() => setShowUploadModal(false)}
                                className="bg-slate-100 text-slate-800 hover:bg-slate-200"
                                disabled={uploading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                variant="crear"
                                onClick={handleUpload}
                                disabled={!quotationUrl.trim() || uploading}
                                className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
                            >
                                {uploading ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
