import { PageHeader, type Crumb } from '@/components/public/page-header';
import { capitalize } from '@/lib/format';
import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Mail, Phone } from 'lucide-react';
import type { ReactNode } from 'react';

export type QuotableUnit = { name: string; display_name: string };

/** One line per unit, from the corporate site's service explorer. */
export const unitSummaries: Record<string, string> = {
    auditoria: 'Auditorías de primera y segunda parte y verificaciones regulatorias, con auditores líderes certificados.',
    consultoria: 'Diagnóstico, diseño, implementación y mantenimiento de sistemas de gestión con su equipo.',
    formacion: 'Diplomados, cursos de fundamentos y formación y calificación de auditores internos.',
};

const quickLink =
    'inline-flex min-h-11 items-center gap-2 rounded-control border-2 border-azul px-4 py-2 font-display text-base font-bold text-azul no-underline';

type QuoteShellProps = {
    title: string;
    lede?: string;
    crumb: string;
    crumbs?: Crumb[];
    units: QuotableUnit[];
    /** Unit on view; null on the page where it is chosen. */
    active: string | null;
    /** Hide the tabs (e.g. once the request is sent). */
    tabs?: boolean;
    children: ReactNode;
};

/**
 * What every quotation page shares, so choosing a unit and filling its request
 * read as one place: the page header (with call / write first on phones, as on
 * the corporate contact page) and the service explorer's unit tabs, fixed under
 * the site header.
 */
export function QuoteShell({ title, lede, crumb, crumbs = [], units, active, tabs = true, children }: QuoteShellProps) {
    const { company } = usePage<PageProps>().props;

    return (
        <>
            <PageHeader compact title={title} crumb={crumb} crumbs={crumbs} lede={lede}>
                {(company.phone || company.email) && (
                    <div className="flex gap-3 lg:hidden">
                        {company.phone && (
                            <a href={`tel:${company.phone.replace(/[^\d+]/g, '')}`} className={quickLink}>
                                <Phone className="h-[1.125rem] w-[1.125rem]" aria-hidden />
                                Llamar
                            </a>
                        )}
                        {company.email && (
                            <a href={`mailto:${company.email}`} className={quickLink}>
                                <Mail className="h-[1.125rem] w-[1.125rem]" aria-hidden />
                                Correo
                            </a>
                        )}
                    </div>
                )}
            </PageHeader>

            {tabs && units.length > 0 && (
                <nav aria-label="Tipo de servicio" className="sticky top-[5.25rem] z-30 border-b border-linea bg-white lg:top-[5.8125rem]">
                    <div className="frame">
                        <ul className="flex gap-1">
                            {units.map((u) => {
                                const current = u.name === active;
                                return (
                                    <li key={u.name}>
                                        <Link
                                            href={route('quotation.quote.business_unit', u.name)}
                                            aria-current={current ? 'page' : undefined}
                                            className={`relative inline-block whitespace-nowrap px-[clamp(0.5rem,0.2rem+1.5vw,1.25rem)] py-4 font-display text-[clamp(0.9375rem,0.8rem+0.65vw,1.375rem)] font-bold no-underline ${
                                                current
                                                    ? 'text-azul after:absolute after:inset-x-[clamp(0.5rem,0.2rem+1.5vw,1.25rem)] after:bottom-0 after:h-1 after:rounded-t after:bg-azul'
                                                    : 'text-pizarra hover:text-azul'
                                            }`}
                                        >
                                            {capitalize(u.display_name)}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>
            )}

            {children}
        </>
    );
}
