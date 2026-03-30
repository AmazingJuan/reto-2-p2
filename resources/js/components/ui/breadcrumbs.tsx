import { Link, usePage } from '@inertiajs/react';

const routeNameMap: Record<string, string> = {
    dashboard: 'Panel',
    cotizar: 'Cotizar',
    'portafolio-de-servicios': 'Portafolio de servicios',
    servicios: 'Servicios',
    perfil: 'Perfil',
    auditoria: 'Auditoría',
    consultoria: 'Consultoría',
    formacion: 'Formación',
};

function displaySegment(segment: string): string {
    const mapped = routeNameMap[segment.toLowerCase()];
    if (mapped) return mapped;
    return segment.replace(/-/g, ' ');
}

export default function Breadcrumbs() {
    const { url } = usePage();
    const segments = url.split('/').filter(Boolean);

    return (
        <nav
            aria-label="Ruta"
            className="flex flex-wrap items-center justify-center gap-x-0.5 gap-y-1 text-center text-sm font-medium text-white/90 sm:text-base"
        >
            <Link href={route('home')} className="rounded px-0.5 transition-colors hover:text-[#7dd3fc]">
                Inicio
            </Link>
            {segments.map((segment, index) => {
                const href = '/' + segments.slice(0, index + 1).join('/');
                const isLast = index === segments.length - 1;
                const label = displaySegment(segment);
                return (
                    <span key={`${segment}-${index}`} className="flex items-center gap-0.5 sm:gap-1">
                        <span className="px-1 text-white/35 sm:px-1.5" aria-hidden>
                            /
                        </span>
                        {isLast ? (
                            <span className="max-w-[11rem] truncate font-semibold capitalize text-white sm:max-w-[min(24rem,50vw)]">
                                {label}
                            </span>
                        ) : (
                            <Link href={href} className="rounded px-0.5 capitalize transition-colors hover:text-[#7dd3fc]">
                                {label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
