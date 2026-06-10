import {
    AdminPageHeader,
    adminFieldInputClass,
    adminFieldLabelClass,
    adminListShellClass,
    adminOutlineButtonClass,
    adminPrimaryButtonClass,
} from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Download, ScrollText, Upload } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

interface QuotationOrder {
    id: number | string;
    quotation_code?: string | null;
    contact_info?: {
        name: string;
        email: string;
        company?: string | null;
        phone?: string;
        role?: string;
    };
    business_unit?: string;
    gestion_line?: string;
    professional?: {
        id: number;
        name: string;
        summary: string;
        years_experience: number;
    } | null;
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

const labelTd =
    'w-[36%] min-w-[7rem] px-3 py-3 align-top text-sm font-semibold text-slate-600 sm:w-1/3 sm:px-6 sm:py-4';
const valueTd = 'px-3 py-3 text-sm text-slate-900 sm:px-6 sm:py-4 sm:text-base';
const rowHover = 'transition hover:bg-slate-50/80';

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
                <div className="px-2 py-8 text-center text-slate-500">No se encontró la cotización.</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Head title={quotationOrder.quotation_code ? `Cotización ${quotationOrder.quotation_code}` : `Cotización #${quotationOrder.id}`} />

            <div className={adminListShellClass}>
                <FlashAlert flash={flash} />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-3">
                        <Link
                            href={route('dashboard.quotation-orders.index')}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#0693e3]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al listado
                        </Link>
                        <AdminPageHeader
                            icon={ScrollText}
                            title={quotationOrder.quotation_code ? `Cotización ${quotationOrder.quotation_code}` : `Cotización #${quotationOrder.id}`}
                            description="Detalle de la solicitud"
                        />
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
                        {!quotationOrder.is_generated ? (
                            <Button
                                type="button"
                                onClick={() => setShowUploadModal(true)}
                                variant="outline"
                                className="w-full rounded-xl border-emerald-300 bg-emerald-50 font-semibold text-emerald-900 shadow-sm hover:bg-emerald-100 sm:w-auto"
                            >
                                <Upload className="h-4 w-4" />
                                Subir propuesta
                            </Button>
                        ) : quotationOrder.quotation_url ? (
                            <a
                                href={quotationOrder.quotation_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    adminPrimaryButtonClass,
                                    'inline-flex w-full items-center justify-center gap-2 sm:w-auto',
                                )}
                            >
                                <Download className="h-4 w-4" />
                                Descargar PDF
                            </a>
                        ) : null}
                    </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 [-webkit-overflow-scrolling:touch]">
                    <table className="w-full min-w-[280px]">
                        <tbody className="divide-y divide-slate-100">
                            {quotationOrder.quotation_code && (
                                <tr className={rowHover}>
                                    <td className={labelTd}>Código</td>
                                    <td className={`${valueTd} font-mono font-semibold`}>{quotationOrder.quotation_code}</td>
                                </tr>
                            )}

                            <tr className={rowHover}>
                                <td className={labelTd}>ID interno</td>
                                <td className={`${valueTd} font-mono text-sm text-slate-600`}>{quotationOrder.id}</td>
                            </tr>

                            <tr className={rowHover}>
                                <td className={labelTd}>Estado</td>
                                <td className={valueTd}>
                                    {quotationOrder.is_generated ? (
                                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200/80">
                                            Generada
                                        </span>
                                    ) : (
                                        <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-900 ring-1 ring-amber-200/80">
                                            Pendiente
                                        </span>
                                    )}
                                </td>
                            </tr>

                            {quotationOrder.contact_info && (
                                <>
                                    <tr className={rowHover}>
                                        <td className={labelTd}>Nombre</td>
                                        <td className={valueTd}>{quotationOrder.contact_info.name}</td>
                                    </tr>
                                    <tr className={rowHover}>
                                        <td className={labelTd}>Email</td>
                                        <td className={valueTd}>{quotationOrder.contact_info.email}</td>
                                    </tr>
                                    {quotationOrder.contact_info.company && (
                                        <tr className={rowHover}>
                                            <td className={labelTd}>Empresa</td>
                                            <td className={valueTd}>{quotationOrder.contact_info.company}</td>
                                        </tr>
                                    )}
                                    {quotationOrder.contact_info.phone && (
                                        <tr className={rowHover}>
                                            <td className={labelTd}>Teléfono</td>
                                            <td className={valueTd}>{quotationOrder.contact_info.phone}</td>
                                        </tr>
                                    )}
                                    <tr className={rowHover}>
                                        <td className={labelTd}>Cargo</td>
                                        <td className={valueTd}>{quotationOrder.contact_info.role}</td>
                                    </tr>
                                </>
                            )}

                            {quotationOrder.business_unit && (
                                <tr className={rowHover}>
                                    <td className={labelTd}>Unidad de negocio</td>
                                    <td className={valueTd}>{quotationOrder.business_unit}</td>
                                </tr>
                            )}

                            {quotationOrder.gestion_line && (
                                <tr className={rowHover}>
                                    <td className={labelTd}>Línea de gestión</td>
                                    <td className={valueTd}>{quotationOrder.gestion_line}</td>
                                </tr>
                            )}

                            {quotationOrder.professional && (
                                <>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-3 py-3 align-top text-sm font-semibold text-gray-600 sm:px-6 sm:py-4 sm:text-base">
                                            Profesional asignado
                                        </td>
                                        <td className="px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4 sm:text-base">
                                            {quotationOrder.professional.name}{' '}
                                            <span className="text-gray-500">({quotationOrder.professional.years_experience} años)</span>
                                        </td>
                                    </tr>
                                    <tr className="align-top hover:bg-gray-50">
                                        <td className="px-3 py-3 align-top text-sm font-semibold text-gray-600 sm:px-6 sm:py-4 sm:text-base">
                                            Resumen del profesional
                                        </td>
                                        <td className="whitespace-pre-wrap px-3 py-3 text-sm text-gray-900 sm:px-6 sm:py-4 sm:text-base">
                                            {quotationOrder.professional.summary}
                                        </td>
                                    </tr>
                                </>
                            )}

                            {quotationOrder.services && quotationOrder.services.length > 0 && (
                                <tr className={cn(rowHover, 'align-top')}>
                                    <td className={labelTd}>Servicios</td>
                                    <td className={valueTd}>
                                        <ul className="list-inside list-disc space-y-1 text-slate-900">
                                            {quotationOrder.services.map((service, idx) => (
                                                <li key={idx}>{service}</li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            )}

                            {quotationOrder.answers && Object.keys(quotationOrder.answers).length > 0 && (
                                <tr className={cn(rowHover, 'align-top')}>
                                    <td className={labelTd}>Respuestas</td>
                                    <td className={valueTd}>
                                        <ul className="list-inside list-disc space-y-1 text-slate-900">
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
                                <tr className={rowHover}>
                                    <td className={labelTd}>Fecha de creación</td>
                                    <td className={valueTd}>
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
                        className="absolute inset-0 bg-slate-900/40"
                        aria-label="Cerrar"
                        onClick={() => setShowUploadModal(false)}
                    />
                    <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)]">
                        <h3 className="mb-1 text-lg font-bold tracking-tight text-slate-900">Subir enlace de propuesta</h3>
                        <p className="mb-4 text-sm text-slate-600">Pega la URL pública del PDF o documento de la propuesta.</p>

                        <div className="mb-4">
                            <label htmlFor="quotation_url" className={adminFieldLabelClass}>
                                URL de la propuesta
                            </label>
                            <input
                                id="quotation_url"
                                type="text"
                                value={quotationUrl}
                                onChange={(e) => setQuotationUrl(e.target.value)}
                                placeholder="https://ejemplo.com/propuesta.pdf"
                                className={cn(
                                    adminFieldInputClass,
                                    errors.quotation_url && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
                                )}
                            />
                            {errors.quotation_url && <p className="mt-1 text-sm text-red-600">{errors.quotation_url}</p>}
                        </div>

                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowUploadModal(false)}
                                className={cn(adminOutlineButtonClass, 'w-full sm:w-auto')}
                                disabled={uploading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                onClick={handleUpload}
                                disabled={!quotationUrl.trim() || uploading}
                                size="sm"
                                className={cn(adminPrimaryButtonClass, 'w-full sm:w-auto disabled:opacity-50')}
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
