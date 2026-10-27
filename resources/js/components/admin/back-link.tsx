import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

/** Way back to the listing a page belongs to: a button, so it reads as an action and not as a breadcrumb. */
export function BackLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="inline-flex min-h-11 items-center gap-2 rounded-control border-2 border-linea bg-white py-2 pl-3 pr-4 font-display text-sm font-bold text-azul no-underline transition-colors hover:border-azul hover:bg-nube focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-azul-vivo"
        >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            Volver a {label.toLowerCase()}
        </Link>
    );
}
