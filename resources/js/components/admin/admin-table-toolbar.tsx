import { Button } from '@/components/ui/button';
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
}

export function AdminTableToolbar({
    routeName,
    filters,
    searchPlaceholder = 'Buscar…',
    extraKeys = [],
    children,
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
        <div className="mx-auto mb-4 flex max-w-6xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <form onSubmit={submit} className="flex w-full max-w-md flex-1 items-center gap-2">
                <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="search"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <Button type="submit" variant="crear" className="shrink-0 bg-slate-700 hover:bg-slate-800">
                    Buscar
                </Button>
                {hasSearch && (
                    <Button type="button" variant="crear" onClick={clearSearch} className="shrink-0 bg-slate-200 text-slate-800 hover:bg-slate-300">
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </form>
            {children}
        </div>
    );
}
