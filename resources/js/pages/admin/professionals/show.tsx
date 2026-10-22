import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { BackLink } from '@/components/admin/back-link';
import { StatusBadge } from '@/components/admin/status-badge';
import { adminCardClass, adminFormShellClass, adminOutlineButtonClass } from '@/components/admin/styles';
import type { Professional } from '@/features/professionals/types';
import AdminLayout from '@/layouts/admin-layout';
import { capitalize, pluralize } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

export default function Show() {
    const { professional } = usePage<PageProps<{ viewData: { professional: Professional } }>>().props.viewData;

    return (
        <AdminLayout title={`Profesional #${professional.id}`}>
            <div className={adminFormShellClass}>
                <BackLink href={route('dashboard.professionals.index')} label="Profesionales" />

                <AdminPageHeader
                    title={professional.name}
                    description={`Profesional #${professional.id} · ${pluralize(professional.years_experience, 'año', 'años')} de experiencia`}
                >
                    <Link
                        href={route('dashboard.professionals.edit', professional.id)}
                        className={cn(adminOutlineButtonClass, 'inline-flex items-center justify-center gap-2 text-sm')}
                    >
                        <Pencil className="h-4 w-4" aria-hidden />
                        Editar
                    </Link>
                </AdminPageHeader>

                <section className={cn(adminCardClass, 'p-6')}>
                    <h2 className="text-sm font-semibold text-tinta">Líneas de gestión</h2>
                    {professional.gestion_lines.length === 0 ? (
                        <p className="mt-2 text-sm text-pizarra">Sin líneas asignadas.</p>
                    ) : (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {professional.gestion_lines.map((line) => (
                                <StatusBadge key={line.id} tone="info">
                                    {capitalize(line.name ?? '')}
                                </StatusBadge>
                            ))}
                        </div>
                    )}
                </section>

                <section className={cn(adminCardClass, 'p-6')}>
                    <h2 className="text-sm font-semibold text-tinta">Resumen</h2>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-tinta">{professional.summary}</p>
                </section>
            </div>
        </AdminLayout>
    );
}
