import { BrandLogo } from '@/components/brand/brand-logo';
import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { corporate } from './links';

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

/** Navy footer of the corporate site, fed by Configuración. */
export function SiteFooter() {
    const { company } = usePage<PageProps>().props;
    const hasContact = Boolean(company.address || company.phone || company.email);

    return (
        <footer className="field-noche text-base print:hidden">
            {hasContact && (
                <div className="frame grid gap-12 py-[clamp(4rem,2.4rem+6.5vw,7rem)] md:grid-cols-[7fr_5fr]">
                    {company.address && (
                        <section aria-labelledby="visit-title">
                            <h2 id="visit-title" className="mb-5 text-base tracking-normal text-cielo">
                                Visítenos
                            </h2>
                            <address className="max-w-xl font-display text-[clamp(1.375rem,1.2rem+0.7vw,1.75rem)] font-semibold not-italic leading-snug tracking-snug">
                                {company.address}
                            </address>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-ghost btn-sm mt-6"
                            >
                                <MapPin className="text-cielo" aria-hidden />
                                Cómo llegar
                                <span className="sr-only"> (abre Google Maps)</span>
                            </a>
                        </section>
                    )}

                    {(company.phone || company.email) && (
                        <section aria-labelledby="reach-title">
                            <h2 id="reach-title" className="mb-5 text-base tracking-normal text-cielo">
                                Llame o escriba
                            </h2>
                            <ul className="grid gap-5">
                                {company.phone && (
                                    <li className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-4">
                                        <Phone className="mt-1.5 h-6 w-6 text-cielo" aria-hidden />
                                        <a
                                            href={telHref(company.phone)}
                                            className="font-display text-[clamp(1.375rem,1.2rem+0.7vw,1.75rem)] font-bold tracking-snug hover:underline"
                                        >
                                            {company.phone}
                                        </a>
                                    </li>
                                )}
                                {company.email && (
                                    <li className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-4">
                                        <Mail className="mt-1 h-6 w-6 text-cielo" aria-hidden />
                                        <a
                                            href={`mailto:${company.email}`}
                                            className="min-w-0 font-display text-lg font-bold tracking-snug hover:underline"
                                        >
                                            {company.email.split('@')[0]}@<wbr />
                                            {company.email.split('@')[1]}
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </section>
                    )}
                </div>
            )}

            <div className={`frame grid gap-10 border-niebla/25 py-10 md:grid-cols-2 ${hasContact ? 'border-t' : ''}`}>
                <div>
                    <BrandLogo inverse />
                    <p className="mt-4 max-w-xs text-niebla">Asesoría, diseño de eventos de formación y evaluación organizacional.</p>
                </div>
                <nav aria-label="Pie de página">
                    <h2 className="mb-3 text-[0.9375rem] tracking-normal">Sitio</h2>
                    <ul className="grid gap-x-6 gap-y-1.5 text-niebla sm:grid-cols-2">
                        <li>
                            <a href={company.website_url ?? corporate.home} className="hover:text-white hover:underline">
                                {company.website_label ?? 'trainingcorporation.com.co'}
                            </a>
                        </li>
                        <li>
                            <a href={corporate.portfolio} className="hover:text-white hover:underline">
                                Portafolio de servicios
                            </a>
                        </li>
                        <li>
                            <Link href={route('quotation.select.business_unit')} className="hover:text-white hover:underline">
                                Solicitar cotización
                            </Link>
                        </li>
                        <li>
                            <a href={corporate.contact} className="hover:text-white hover:underline">
                                Contacto
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="frame">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-niebla/25 pb-8 pt-6 text-[0.9375rem] text-niebla">
                    <p>© {new Date().getFullYear()} Training Corporation S.A.S.</p>
                    <a href={corporate.privacy} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">
                        Protección de datos
                    </a>
                    <Link href={route('dashboard')} className="hover:text-white hover:underline sm:ml-auto">
                        Acceso administradores
                    </Link>
                </div>
            </div>
        </footer>
    );
}
