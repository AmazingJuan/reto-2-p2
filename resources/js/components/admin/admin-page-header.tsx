import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type AdminPageHeaderProps = {
    title: string;
    description?: ReactNode;
    /** Primary actions rendered on the right. */
    children?: ReactNode;
    className?: string;
};

/** Page title in the corporate style: Montserrat 800, brand blue. */
export function AdminPageHeader({ title, description, children, className }: AdminPageHeaderProps) {
    return (
        <header className={cn('flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between', className)}>
            <div className="min-w-0">
                <h1 className="font-display text-[clamp(1.75rem,1.35rem+1.2vw,2.5rem)] font-extrabold leading-[1.1] tracking-tight text-azul">
                    {title}
                </h1>
                {description ? <div className="mt-2 max-w-measure text-base leading-relaxed text-pizarra">{description}</div> : null}
            </div>
            {children ? <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">{children}</div> : null}
        </header>
    );
}
