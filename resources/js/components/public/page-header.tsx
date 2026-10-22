import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

export type Crumb = { label: string; href: string };

type PageHeaderProps = {
    title: string;
    lede?: ReactNode;
    /** Trail before the current page ("Inicio" is added). */
    crumbs?: Crumb[];
    /** Name of this page in the trail, when the title is a sentence. */
    crumb?: string;
    /** Right column (photo ring, facts…). */
    aside?: ReactNode;
    /** Tight version for tool pages: content first. */
    compact?: boolean;
    children?: ReactNode;
};

/** Opening of an inner page, as on the corporate site: breadcrumb, blue title, lede. */
export function PageHeader({ title, lede, crumbs = [], crumb, aside, compact = false, children }: PageHeaderProps) {
    const trail = [{ label: 'Inicio', href: route('home') }, ...crumbs];

    return (
        <header className={cn(compact ? 'pb-7 pt-5 sm:pt-6' : 'pb-[clamp(2.75rem,2rem+3vw,5rem)] pt-[clamp(1.5rem,1rem+2vw,3rem)]')}>
            <div className={cn('frame grid items-center gap-10', aside && 'lg:grid-cols-12')}>
                <div className={cn(aside && 'lg:col-span-7')}>
                    <nav aria-label="Ruta de navegación">
                        <ol className="flex flex-wrap items-center gap-1 text-sm font-semibold">
                            {trail.map((item) => (
                                <li key={item.href} className="inline-flex items-center gap-1">
                                    <Link
                                        href={item.href}
                                        className="text-tinta underline decoration-tinta/40 underline-offset-[0.2em] hover:decoration-tinta"
                                    >
                                        {item.label}
                                    </Link>
                                    <ChevronRight className="h-3.5 w-3.5 opacity-70" aria-hidden />
                                </li>
                            ))}
                            <li aria-current="page" className="hidden text-pizarra sm:inline">
                                {crumb ?? title}
                            </li>
                        </ol>
                    </nav>
                    <h1
                        className={cn(
                            'text-azul',
                            compact
                                ? 'mt-4 font-display text-[clamp(1.75rem,1.35rem+1.6vw,2.75rem)] font-extrabold leading-[1.12] tracking-tight'
                                : 'heading mt-8 max-w-[20ch]',
                        )}
                    >
                        {title}
                    </h1>
                    {lede && <p className={cn('text-pizarra', compact ? 'mt-3 max-w-measure text-lg' : 'lede mt-6')}>{lede}</p>}
                    {children && <div className={compact ? 'mt-4' : 'mt-8'}>{children}</div>}
                </div>
                {aside && <div className="w-full max-w-sm lg:col-span-5 lg:max-w-none">{aside}</div>}
            </div>
        </header>
    );
}
