import { BrandLogo } from '@/components/brand/brand-logo';
import { Link } from '@inertiajs/react';
import { corporate } from './links';

const navLinkClass =
    'inline-flex min-h-[2.75rem] items-center rounded-control px-3.5 font-display text-[0.9375rem] font-semibold text-tinta no-underline transition-colors hover:bg-nube';

/** Same bar as the corporate site: logo, a few links, the quote CTA. */
export function SiteHeader({ showCta = true }: { showCta?: boolean }) {
    return (
        <header className="sticky top-0 z-40 bg-white shadow-[0_1px_0_#d5e2eb] print:static">
            <div className="frame flex min-h-[4.75rem] items-center gap-6">
                <Link href={route('home')} className="mr-auto rounded-control py-2" aria-label="Training Corporation, cotizador">
                    <BrandLogo />
                </Link>

                <nav aria-label="Principal" className="hidden lg:block print:!hidden">
                    <ul className="flex gap-1">
                        <li>
                            <a href={corporate.portfolio} className={navLinkClass}>
                                Portafolio de servicios
                            </a>
                        </li>
                        <li>
                            <a href={corporate.contact} className={navLinkClass}>
                                Contacto
                            </a>
                        </li>
                    </ul>
                </nav>

                {showCta && (
                    <Link href={route('quotation.select.business_unit')} className="btn btn-primary btn-sm sm:min-h-[3.25rem] sm:px-6 print:hidden">
                        Solicitar cotización
                    </Link>
                )}
            </div>
        </header>
    );
}
