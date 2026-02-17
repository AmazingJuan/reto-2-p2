import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import AdminLayout from '../../../layouts/admin-layout';

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
    answers?: Record<string, any>;
    is_generated: boolean;
    quotation_url?: string;
    created_at?: string;
    updated_at?: string;
}

interface ShowPageProps extends Record<string, unknown> {
    auth: { user: any };
    viewData: {
        quotationOrder: QuotationOrder;
    };
}

export default function Show() {
    const { viewData, errors } = usePage<ShowPageProps>().props;
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
            <div className="p-6">
                {/* Encabezado */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('dashboard.quotation-orders.index')} className="flex items-center text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="mr-1 h-5 w-5" /> Volver
                        </Link>
                        <h1 className="text-2xl font-bold">Cotización #{quotationOrder.id}</h1>
                    </div>

                    <div>
                        {!quotationOrder.is_generated ? (
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white transition hover:bg-emerald-700"
                            >
                                <Upload className="mr-2 h-5 w-5" />
                                Subir Propuesta
                            </button>
                        ) : quotationOrder.quotation_url ? (
                            <a
                                href={quotationOrder.quotation_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                            >
                                <Download className="mr-2 h-5 w-5" />
                                Descargar PDF
                            </a>
                        ) : null}
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="rounded-lg border bg-white p-6 shadow-md">
                    <table className="w-full">
                        <tbody className="divide-y">
                            {/* ID */}
                            <tr className="hover:bg-gray-50">
                                <td className="w-1/3 px-6 py-4 font-semibold text-gray-600">ID</td>
                                <td className="px-6 py-4 text-gray-900">{quotationOrder.id}</td>
                            </tr>

                            {/* Estado */}
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-semibold text-gray-600">Estado</td>
                                <td className="px-6 py-4">
                                    {quotationOrder.is_generated ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                            Generada
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                                            Pendiente
                                        </span>
                                    )}
                                </td>
                            </tr>

                            {/* Contacto */}
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

                            {/* Unidad de Negocio */}
                            {quotationOrder.business_unit && (
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold text-gray-600">Unidad de Negocio</td>
                                    <td className="px-6 py-4 text-gray-900">{quotationOrder.business_unit}</td>
                                </tr>
                            )}

                            {/* Línea de Gestión */}
                            {quotationOrder.gestion_line && (
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold text-gray-600">Línea de Gestión</td>
                                    <td className="px-6 py-4 text-gray-900">{quotationOrder.gestion_line}</td>
                                </tr>
                            )}

                            {/* Servicios */}
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

                            {/* Respuestas */}
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

                            {/* Fecha de Creación */}
                            {quotationOrder.created_at && (
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold text-gray-600">Fecha de Creación</td>
                                    <td className="px-6 py-4 text-gray-900">{new Date(quotationOrder.created_at).toLocaleDateString('es-CO')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para subir propuesta */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowUploadModal(false)} />

                    <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="mb-4 text-xl font-bold text-gray-900">Subir Link de Propuesta</h3>

                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">URL de la propuesta</label>
                            <input
                                type="url"
                                value={quotationUrl}
                                onChange={(e) => setQuotationUrl(e.target.value)}
                                placeholder="https://ejemplo.com/propuesta.pdf"
                                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                                    errors.quotation_url
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
                                }`}
                            />
                            {errors.quotation_url && <p className="mt-1 text-sm text-red-600">{errors.quotation_url}</p>}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                disabled={uploading}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!quotationUrl.trim() || uploading}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:bg-gray-300"
                            >
                                {uploading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
