import { router } from '@inertiajs/react';
import { useCallback } from 'react';

type QueryValue = string | number | null | undefined;

/**
 * Navigates an admin listing keeping the current filters. Empty values and the
 * "all" sentinel are dropped so URLs stay clean; changing any filter resets to
 * page 1 unless a page is given.
 */
export function useListFilters(routeName: string, filters: Record<string, QueryValue>) {
    return useCallback(
        (overrides: Record<string, QueryValue> = {}) => {
            const params = Object.fromEntries(
                Object.entries({ ...filters, page: undefined, ...overrides }).filter(
                    ([key, value]) => value !== '' && value !== null && value !== undefined && value !== 'all' && !(key === 'page' && value === 1),
                ),
            );

            router.get(route(routeName), params, { preserveState: true, preserveScroll: true, replace: true });
        },
        [routeName, filters],
    );
}
