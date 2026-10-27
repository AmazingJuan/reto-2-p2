import { PageHeader, type Crumb } from '@/components/public/page-header';
import { capitalize } from '@/lib/format';
import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

export type QuotableUnit = { name: string; display_name: string };

/** One line per unit, from the corporate site's service explorer. */
export const unitSummaries: Record<string, string> = {
    auditoria: 'Auditorías de primera y segunda parte y verificaciones regulatorias, con auditores líderes certificados.',
    consultoria: 'Diagnóstico, diseño, implementación y mantenimiento de sistemas de gestión con su equipo.',
    formacion: 'Diplomados, cursos de fundamentos y formación y calificación de auditores internos.',
};

type QuoteShellProps = {
    title: string;
    lede?: string;
    crumb: string;
    crumbs?: Crumb[];
    units: QuotableUnit[];
    /** Unit on view; null on the page where it is chosen. */
    active: string | null;
    /** Hide the tabs (e.g. while a request is filled in, so they are not a one-tap way out of it). */
    tabs?: boolean;
    children: ReactNode;
};

/**
 * What every quotation page shares, so choosing a unit and filling its request
 * read as one place: the page header and the service explorer's unit tabs,
 * fixed under the site header. Calling or writing is offered by the channels
 * panel of each page.
 */
export function QuoteShell({ title, lede, crumb, crumbs = [], units, active, tabs = true, children }: QuoteShellProps) {
    return (
        <>
            <PageHeader compact title={title} crumb={crumb} crumbs={crumbs} lede={lede} />

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
