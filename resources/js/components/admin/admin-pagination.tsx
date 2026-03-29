import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { route as ziggyRoute } from 'ziggy-js';

type RouteName = Parameters<typeof ziggyRoute>[0];

export interface PaginatorMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface AdminPaginationProps {
    routeName: RouteName;
    meta: PaginatorMeta;
    filters: Record<string, string | undefined | null>;
    /** Query keys to include when changing page */
    extraKeys?: string[];
    className?: string;
}

export function AdminPagination({ routeName, meta, filters, extraKeys = [], className }: AdminPaginationProps) {
    const { current_page, last_page, total, from, to } = meta;

    if (last_page <= 1 && total === 0) {
        return null;
    }

    const go = (page: number) => {
        const params: Record<string, string | number> = { page };
        if (filters.search) {
            params.search = filters.search;
        }
        for (const key of extraKeys) {
            const v = filters[key];
            if (v !== undefined && v !== null && v !== '' && v !== 'all') {
                params[key] = v;
            }
        }
        router.get(ziggyRoute(routeName), params, { preserveState: true, replace: true });
    };

    const summary =
        total === 0
            ? 'Sin resultados'
            : from != null && to != null
              ? `Mostrando ${from}–${to} de ${total}`
              : `${total} resultado${total === 1 ? '' : 's'}`;

    return (
        <div
            className={cn(
                'mx-auto mt-4 flex w-full min-w-0 max-w-6xl flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between',
                className,
            )}
        >
            <p className="text-center text-sm text-gray-600 sm:text-left">{summary}</p>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
                <p className="text-center text-sm text-gray-700 sm:hidden">Página {current_page} de {last_page}</p>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="crear"
                        disabled={current_page <= 1}
                        onClick={() => go(current_page - 1)}
                        className="min-h-10 flex-1 bg-white text-slate-800 ring-1 ring-gray-300 hover:bg-gray-50 disabled:opacity-40 sm:flex-none"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                    </Button>
                    <span className="hidden items-center px-1 text-sm text-gray-700 sm:inline">Página {current_page} de {last_page}</span>
                    <Button
                        type="button"
                        variant="crear"
                        disabled={current_page >= last_page}
                        onClick={() => go(current_page + 1)}
                        className="min-h-10 flex-1 bg-white text-slate-800 ring-1 ring-gray-300 hover:bg-gray-50 disabled:opacity-40 sm:flex-none"
                    >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
