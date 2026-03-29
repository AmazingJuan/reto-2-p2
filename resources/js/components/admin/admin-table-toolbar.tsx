import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { route as ziggyRoute } from 'ziggy-js';

type RouteName = Parameters<typeof ziggyRoute>[0];

interface AdminTableToolbarProps {
    routeName: RouteName;
    filters: Record<string, string | undefined | null>;
    searchPlaceholder?: string;
    /** Extra query keys to preserve (e.g. business_unit_id for services) */
    extraKeys?: string[];
    children?: ReactNode;
    className?: string;
}

export function AdminTableToolbar({
    routeName,
    filters,
    searchPlaceholder = 'Buscar…',
    extraKeys = [],
    children,
    className,
}: AdminTableToolbarProps) {
    const [q, setQ] = useState(() => filters.search ?? '');

    useEffect(() => {
        setQ(filters.search ?? '');
    }, [filters.search]);

    const buildParams = (overrides: Record<string, string | number | undefined>) => {
        const params: Record<string, string | number> = { page: 1, ...overrides };
        const searchVal = overrides.search !== undefined ? String(overrides.search) : q.trim();
        if (searchVal) {
            params.search = searchVal;
        }
        for (const key of extraKeys) {
            const v = filters[key];
            if (v !== undefined && v !== null && v !== '' && v !== 'all') {
                params[key] = v;
            }
        }
        return params;
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get(ziggyRoute(routeName), buildParams({ search: q.trim() }), { preserveState: true, replace: true });
    };

    const clearSearch = () => {
        setQ('');
        const params: Record<string, string | number> = { page: 1 };
        for (const key of extraKeys) {
            const v = filters[key];
            if (v !== undefined && v !== null && v !== '' && v !== 'all') {
                params[key] = v;
            }
        }
        router.get(ziggyRoute(routeName), params, { preserveState: true, replace: true });
    };

    const hasSearch = Boolean(filters.search);

    return (
        <div
            className={cn(
                'mx-auto mb-4 flex w-full min-w-0 max-w-6xl flex-col gap-3 md:flex-row md:flex-wrap md:items-end md:justify-between',
                className,
            )}
        >
            <form
                onSubmit={submit}
                className="flex w-full min-w-0 flex-col gap-2 sm:max-w-xl sm:flex-1 sm:flex-row sm:items-center sm:gap-2 md:max-w-md"
            >
                <div className="relative w-full min-w-0 sm:flex-1">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                        aria-hidden
                    />
                    <input
                        type="search"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full min-w-0 rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <Button type="submit" variant="crear" className="min-h-[42px] flex-1 bg-slate-700 hover:bg-slate-800 sm:flex-none">
                        Buscar
                    </Button>
                    {hasSearch && (
                        <Button
                            type="button"
                            variant="crear"
                            onClick={clearSearch}
                            className="min-h-[42px] shrink-0 bg-slate-200 text-slate-800 hover:bg-slate-300"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </form>
            {children}
        </div>
    );
}
