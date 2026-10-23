import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { BackLink } from '@/components/admin/back-link';
import { DataTable } from '@/components/admin/data-table';
import { DetailList } from '@/components/admin/detail-list';
import { RowActions, ViewAction } from '@/components/admin/row-actions';
import { QuotationStatusBadge } from '@/components/admin/status-badge';
import { adminCardClass, adminListShellClass, adminTableTdClass } from '@/components/admin/styles';
import type { ClientWithStats } from '@/features/clients/types';
import AdminLayout from '@/layouts/admin-layout';
import { formatDate, orDash } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

type Quotation = {
    id: string;
    quotation_code: string | null;
    business_unit: string;
    is_generated: boolean;
    created_at: string | null;
};

type ShowPageProps = PageProps<{ viewData: { client: ClientWithStats; quotations: Quotation[] } }>;

type StatusFilter = 'all' | 'generated' | 'pending';

export default function Show() {
    const { client, quotations } = usePage<ShowPageProps>().props.viewData;
    const [status, setStatus] = useState<StatusFilter>('all');

    const visible = quotations.filter((q) => status === 'all' || q.is_generated === (status === 'generated'));

    const tabs: { id: StatusFilter; label: string; count: number }[] = [
        { id: 'all', label: 'Todas', count: client.quotations_count },
        { id: 'generated', label: 'Generadas', count: client.generated_count },
        { id: 'pending', label: 'Pendientes', count: client.pending_count },
    ];

    return (
        <AdminLayout title={client.name || 'Cliente'}>
            <div className={adminListShellClass}>
                <BackLink href={route('dashboard.clients.index')} label="Clientes" />
                <AdminPageHeader
                    title={client.name || 'Cliente'}
                    description={[client.role, client.company].filter(Boolean).join(' · ') || undefined}
                />

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <DetailList
                        className="lg:col-span-2"
                        title="Contacto"
                        items={[
                            {
                                label: 'Correo',
                                value: (
                                    <a href={`mailto:${client.email}`} className="text-azul-hondo hover:underline">
                                        {client.email}
                                    </a>
                                ),
                            },
                            {
                                label: 'Teléfono',
                                value: client.phone ? (
                                    <a href={`tel:${client.phone}`} className="hover:underline">
                                        {client.phone}
                                    </a>
                                ) : (
                                    '—'
                                ),
                            },
                            { label: 'Razón social', value: orDash(client.company) },
                            { label: 'NIT', value: orDash(client.nit) },
                            { label: 'Actividad económica', value: orDash(client.economic_activity) },
                            { label: 'Dirección', value: orDash(client.address) },
                            { label: 'Cargo', value: orDash(client.role) },
                            { label: 'Cliente desde', value: formatDate(client.first_quotation_at) },
                        ]}
                    />
                    <dl className={cn(adminCardClass, 'grid grid-cols-3 divide-x divide-nube self-start lg:grid-cols-1 lg:divide-x-0 lg:divide-y')}>
                        {tabs.map((tab) => (
                            <div key={tab.id} className="px-5 py-4">
                                <dt className="text-sm text-pizarra">{tab.id === 'all' ? 'Cotizaciones' : tab.label}</dt>
                                <dd className="mt-1 text-2xl font-bold tabular-nums text-tinta">{tab.count}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <section className="space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-semibold text-tinta">Historial de cotizaciones</h2>
                        <div role="tablist" aria-label="Filtrar por estado" className="inline-flex rounded-control bg-nube p-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={status === tab.id}
                                    onClick={() => setStatus(tab.id)}
                                    className={cn(
                                        'rounded-md px-3 py-1.5 text-sm font-medium transition',
                                        status === tab.id ? 'bg-white text-tinta' : 'text-pizarra hover:text-tinta',
                                    )}
                                >
                                    {tab.label} <span className="ml-1 tabular-nums text-gris-marca">{tab.count}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <DataTable
                        columns={[{ label: 'Código' }, { label: 'Unidad' }, { label: 'Estado' }, { label: 'Fecha' }, { label: '', align: 'center' }]}
                        minWidth="48rem"
                        isEmpty={visible.length === 0}
                        emptyMessage="No hay cotizaciones en esta vista."
                    >
                        {visible.map((quotation) => (
                            <tr key={quotation.id} className="hover:bg-nube/70">
                                <td className={cn(adminTableTdClass, 'font-display font-bold')}>
                                    <Link
                                        href={route('dashboard.quotation-orders.show', quotation.id)}
                                        className="hover:text-azul-hondo hover:underline"
                                    >
                                        {quotation.quotation_code ?? '—'}
                                    </Link>
                                </td>
                                <td className={adminTableTdClass}>{quotation.business_unit}</td>
                                <td className={adminTableTdClass}>
                                    <QuotationStatusBadge generated={quotation.is_generated} />
                                </td>
                                <td className={cn(adminTableTdClass, 'whitespace-nowrap tabular-nums')}>{formatDate(quotation.created_at)}</td>
                                <td className={cn(adminTableTdClass, 'w-20')}>
                                    <RowActions>
                                        <ViewAction href={route('dashboard.quotation-orders.show', quotation.id)} />
                                    </RowActions>
                                </td>
                            </tr>
                        ))}
                    </DataTable>
                </section>
            </div>
        </AdminLayout>
    );
}
