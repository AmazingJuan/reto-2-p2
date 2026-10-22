import { cn } from '@/lib/utils';
import type { Paginated } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type AdminPaginationProps = {
    meta: Pick<Paginated<unknown>, 'current_page' | 'last_page' | 'total' | 'from' | 'to'>;
    onPageChange: (page: number) => void;
    className?: string;
};

const pagerButtonClass =
    'inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-control border-2 border-linea bg-white px-3 text-sm font-medium text-tinta transition-colors hover:bg-nube disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none';

export function AdminPagination({ meta, onPageChange, className }: AdminPaginationProps) {
    const { current_page, last_page, total, from, to } = meta;

    if (total === 0) {
        return null;
    }

    return (
        <nav aria-label="Paginación" className={cn('flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}>
            <p className="text-center text-sm text-pizarra sm:text-left">
                Mostrando <span className="font-semibold text-tinta">{from}</span>–<span className="font-semibold text-tinta">{to}</span> de{' '}
                <span className="font-semibold text-tinta">{total}</span>
            </p>
            {last_page > 1 && (
                <div className="flex items-center gap-2">
                    <button type="button" className={pagerButtonClass} disabled={current_page <= 1} onClick={() => onPageChange(current_page - 1)}>
                        <ChevronLeft className="h-4 w-4" aria-hidden />
                        Anterior
                    </button>
                    <span className="px-2 text-sm tabular-nums text-pizarra" aria-current="page">
                        {current_page} / {last_page}
                    </span>
                    <button
                        type="button"
                        className={pagerButtonClass}
                        disabled={current_page >= last_page}
                        onClick={() => onPageChange(current_page + 1)}
                    >
                        Siguiente
                        <ChevronRight className="h-4 w-4" aria-hidden />
                    </button>
                </div>
            )}
        </nav>
    );
}
