import {
    AdminPageHeader,
    adminListShellClass,
    adminTableCardClass,
    adminTableTdClass,
    adminTableThCenterClass,
    adminTableThClass,
} from '@/components/admin/admin-page-header';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Contact, Download, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

type StatusFilter = 'all' | 'generated' | 'pending';

interface Client {
    id: number;
    name: string;
    email: string;
    company?: string | null;
    phone?: string | null;
    role?: string | null;
    quotations_count: number;
    generated_count: number;
    pending_count: number;
    first_quotation_at?: string | null;
    last_quotation_at?: string | null;
}

interface Quotation {
    id: number | string;
    quotation_code?: string | null;
    business_unit?: string | null;
    gestion_line?: string | null;
    services_count: number;
    is_generated: boolean;
    quotation_url?: string | null;
    created_at?: string | null;
}

type ShowPageProps = PageProps<{
    viewData: {
        client: Client;
        quotations: Quotation[];
    };
}>;

function formatDate(value?: string | null): string {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('es-CO');
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: 'blue' | 'emerald' | 'amber' }) {
    const tones: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-700 ring-blue-200/80',
        emerald: 'bg-emerald-50 text-emerald-800 ring-emerald-200/80',
        amber: 'bg-amber-50 text-amber-900 ring-amber-200/80',
    };

    return (
        <div className={`rounded-2xl px-4 py-3 ring-1 ${tones[tone]}`}>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <p className="text-xs font-medium uppercase tracking-wide opacity-80">{label}</p>
        </div>
    );
}

export default function Show() {
    const { viewData, flash } = usePage<ShowPageProps & { flash: Record<string, unknown> }>().props;
    const { client, quotations } = viewData;

    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    const filteredQuotations = quotations.filter((q) => {
        if (statusFilter === 'generated') return q.is_generated;
        if (statusFilter === 'pending') return !q.is_generated;
        return true;
    });

    const statusTabs: { id: StatusFilter; label: string; count: number }[] = [
        { id: 'all', label: 'Todas', count: client.quotations_count },
        { id: 'generated', label: 'Generadas', count: client.generated_count },
        { id: 'pending', label: 'Pendientes', count: client.pending_count },
    ];

    return (
        <AdminLayout>
            <Head title={client.name ? `Cliente · ${client.name}` : 'Cliente'} />

            <div className={adminListShellClass}>
                <FlashAlert flash={flash} />

                <div className="space-y-3">
                    <Link
                        href={route('dashboard.clients.index')}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#0693e3]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a clientes
                    </Link>
                    <AdminPageHeader icon={Contact} title={client.name || 'Cliente'} description={client.role || undefined} />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Datos de contacto</h2>
                        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                                <div className="min-w-0">
                                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Correo</dt>
                                    <dd className="truncate text-sm text-slate-900">{client.email || '—'}</dd>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                                <div className="min-w-0">
                                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Teléfono</dt>
                                    <dd className="text-sm text-slate-900">{client.phone || '—'}</dd>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Contact className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                                <div className="min-w-0">
                                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Empresa</dt>
                                    <dd className="text-sm text-slate-900">{client.company || '—'}</dd>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                                <div className="min-w-0">
                                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Última cotización</dt>
                                    <dd className="text-sm text-slate-900">{formatDate(client.last_quotation_at)}</dd>
                                </div>
                            </div>
                        </dl>
                    </div>

                    <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
                        <StatCard label="Cotizaciones" value={client.quotations_count} tone="blue" />
                        <StatCard label="Generadas" value={client.generated_count} tone="emerald" />
                        <StatCard label="Pendientes" value={client.pending_count} tone="amber" />
                    </div>
                </div>

                <div>
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-bold tracking-tight text-slate-900">Cotizaciones del cliente</h2>
                        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                            {statusTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setStatusFilter(tab.id)}
                                    className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                                        statusFilter === tab.id
                                            ? 'bg-white text-[#0693e3] shadow-sm ring-1 ring-slate-200'
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {tab.label}
                                    <span className="ml-1.5 text-xs text-slate-400">{tab.count}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={adminTableCardClass}>
                        <table className="min-w-[52rem] w-full divide-y divide-slate-200 lg:min-w-full">
                            <thead className="border-b border-slate-100 bg-slate-50/50">
                                <tr>
                                    <th className={adminTableThClass}>Código</th>
                                    <th className={adminTableThClass}>Unidad</th>
                                    <th className={adminTableThClass}>Línea de gestión</th>
                                    <th className={adminTableThCenterClass}>Servicios</th>
                                    <th className={adminTableThClass}>Estado</th>
                                    <th className={adminTableThClass}>Fecha</th>
                                    <th className={adminTableThCenterClass}>Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filteredQuotations.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
                                            {statusFilter === 'generated'
                                                ? 'Este cliente no tiene cotizaciones generadas.'
                                                : statusFilter === 'pending'
                                                  ? 'Este cliente no tiene cotizaciones pendientes.'
                                                  : 'Este cliente no tiene cotizaciones.'}
                                        </td>
                                    </tr>
                                )}
                                {filteredQuotations.map((quotation) => (
                                    <tr
                                        key={String(quotation.id)}
                                        className="cursor-pointer transition hover:bg-slate-50/80"
                                        onClick={() => router.visit(route('dashboard.quotation-orders.show', quotation.id))}
                                    >
                                        <td className={`${adminTableTdClass} font-mono text-sm`}>{quotation.quotation_code || '—'}</td>
                                        <td className={adminTableTdClass}>{quotation.business_unit || '—'}</td>
                                        <td className={adminTableTdClass}>{quotation.gestion_line || '—'}</td>
                                        <td className={`${adminTableTdClass} text-center`}>{quotation.services_count}</td>
                                        <td className={adminTableTdClass}>
                                            {quotation.is_generated ? (
                                                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200/80">
                                                    Generada
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 ring-1 ring-amber-200/80">
                                                    Pendiente
                                                </span>
                                            )}
                                        </td>
                                        <td className={adminTableTdClass}>{formatDate(quotation.created_at)}</td>
                                        <td className={`${adminTableTdClass} text-center`} onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-1">
                                                <Link
                                                    href={route('dashboard.quotation-orders.show', quotation.id)}
                                                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-[#0693e3] transition hover:bg-blue-50 hover:text-[#047ac0]"
                                                    title="Ver cotización"
                                                >
                                                    Ver
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                                {quotation.is_generated && quotation.quotation_url ? (
                                                    <a
                                                        href={quotation.quotation_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="rounded-lg p-1.5 text-emerald-700 transition hover:bg-emerald-50"
                                                        title="Abrir propuesta"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
