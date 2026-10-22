import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export function BackLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-pizarra transition-colors hover:text-azul-hondo"
        >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {label}
        </Link>
    );
}
