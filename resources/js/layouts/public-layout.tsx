import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';
import FlashAlert from '@/components/ui/flashalert';
import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

type PublicLayoutProps = {
    title?: string;
    /** Hide the header CTA on pages that are already the quote flow. */
    showCta?: boolean;
    children: ReactNode;
};

/** Shell of the client-facing quotation site, matching the corporate site. */
export default function PublicLayout({ title, showCta = true, children }: PublicLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-white text-lg text-tinta">
            {title && <Head title={title} />}

            <a
                href="#contenido"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-control focus:bg-white focus:px-4 focus:py-2"
            >
                Saltar al contenido
            </a>

            <SiteHeader showCta={showCta} />

            <main id="contenido" tabIndex={-1} className="flex-1">
                <div className="frame empty:hidden [&:not(:empty)]:pt-6">
                    <FlashAlert />
                </div>
                {children}
            </main>

            <SiteFooter />
        </div>
    );
}
