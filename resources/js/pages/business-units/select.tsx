import { RingArrow } from '@/components/brand/brand-ring';
import { corporate } from '@/components/public/links';
import { PageHeader } from '@/components/public/page-header';
import PublicLayout from '@/layouts/public-layout';
import { pluralize } from '@/lib/format';
import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';

type BusinessUnit = { name: string; display_name: string; services_count: number };

export default function SelectBusinessUnit() {
    const { businessUnits } = usePage<PageProps<{ viewData: { businessUnits: BusinessUnit[] } }>>().props.viewData;

    return (
        <PublicLayout title="Solicitar cotización" showCta={false}>
            <PageHeader
                title="¿Qué necesita cotizar?"
                crumb="Solicitar cotización"
                lede="Elija el tipo de servicio. Después podrá escoger los servicios concretos y responder unas preguntas sobre su organización."
            />

            <section className="frame pb-[clamp(4rem,2.4rem+6.5vw,9rem)]">
                {businessUnits.length === 0 ? (
                    <p className="max-w-measure rounded-[10px] border-2 border-linea p-6">
                        En este momento no hay servicios disponibles para cotizar en línea. Escríbanos desde la{' '}
                        <a href={corporate.contact} className="link">
                            página de contacto
                        </a>{' '}
                        y le atenderemos directamente.
                    </p>
                ) : (
                    <ul className="grid border-t-2 border-linea">
                        {businessUnits.map((unit) => (
                            <li key={unit.name} className="border-b-2 border-linea">
                                <Link
                                    href={route('quotation.quote.business_unit', unit.name)}
                                    className="group flex items-center gap-6 py-7 no-underline focus-visible:outline-offset-4 sm:py-9"
                                >
                                    <span className="min-w-0 flex-1">
                                        <span className="block font-display text-[clamp(1.75rem,1.35rem+1.6vw,2.75rem)] font-extrabold leading-tight tracking-tight text-azul transition-colors group-hover:text-azul-hondo">
                                            {unit.display_name}
                                        </span>
                                        <span className="mt-1 block text-base text-pizarra">
                                            {pluralize(unit.services_count, 'servicio disponible', 'servicios disponibles')}
                                        </span>
                                    </span>
                                    <RingArrow className="h-12 w-12" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </PublicLayout>
    );
}
