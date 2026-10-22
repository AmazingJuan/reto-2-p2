import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { adminCardClass } from './styles';

export type DetailItem = { label: string; value: ReactNode; hidden?: boolean };

/** Card with a label/value description list. Items with `hidden` are skipped. */
export function DetailList({ title, items, className }: { title: string; items: DetailItem[]; className?: string }) {
    return (
        <section className={cn(adminCardClass, 'p-6', className)}>
            <h2 className="text-sm font-semibold text-tinta">{title}</h2>
            <dl className="mt-4 divide-y divide-nube">
                {items
                    .filter((item) => !item.hidden)
                    .map((item) => (
                        <div key={item.label} className="grid grid-cols-1 gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[11rem_1fr] sm:gap-4">
                            <dt className="text-sm font-medium text-pizarra">{item.label}</dt>
                            <dd className="min-w-0 break-words text-sm text-tinta">{item.value}</dd>
                        </div>
                    ))}
            </dl>
        </section>
    );
}
