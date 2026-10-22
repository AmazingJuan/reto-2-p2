import { BrandLogo } from '@/components/brand/brand-logo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

/** Auth screens: logo on white, a bordered card, the corporate type. */
export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-nube px-4 py-12 text-lg text-tinta">
            <Link href="/" className="mb-8 rounded-control" aria-label="Training Corporation, cotizador">
                <BrandLogo className="w-36 lg:w-40" />
            </Link>
            <div className="w-full max-w-md rounded-[10px] border-2 border-linea bg-white p-6 sm:p-9">{children}</div>
        </div>
    );
}
