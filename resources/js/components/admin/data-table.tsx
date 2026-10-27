import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { adminCardClass, adminTableThClass } from './styles';

export type Column = {
    label: string;
    align?: 'left' | 'center' | 'right';
    /** Extra classes for the header cell (e.g. responsive visibility). */
    className?: string;
};

type DataTableProps = {
    columns: Column[];
    /** Minimum table width before horizontal scrolling kicks in. */
    minWidth?: string;
    isEmpty: boolean;
    emptyMessage: ReactNode;
    children: ReactNode;
};

const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' } as const;

/** Card + scrollable table with a header row and an empty state. On narrow screens a shadow at the edge shows there is more to scroll to. */
export function DataTable({ columns, minWidth = '40rem', isEmpty, emptyMessage, children }: DataTableProps) {
    return (
        <div className={cn(adminCardClass, 'scroll-x-hint w-full min-w-0 overflow-x-auto')}>
            <table className="w-full divide-y divide-linea" style={{ minWidth }}>
                <thead className="bg-nube/70">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.label}
                                scope="col"
                                className={cn(adminTableThClass, alignClass[column.align ?? 'left'], column.className)}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-nube">
                    {isEmpty ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-pizarra">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        children
                    )}
                </tbody>
            </table>
        </div>
    );
}
