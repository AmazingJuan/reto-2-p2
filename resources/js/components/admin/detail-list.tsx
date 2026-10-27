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
                        // Label beside the value when the card has room for both, above it in a narrow card.
                        <div key={item.label} className="flex flex-wrap gap-x-4 gap-y-1 py-3 first:pt-0 last:pb-0">
                            <dt className="w-44 shrink-0 text-sm font-medium text-pizarra">{item.label}</dt>
                            <dd className="min-w-[min(100%,12rem)] flex-1 break-words text-sm text-tinta">{item.value}</dd>
                        </div>
                    ))}
            </dl>
        </section>
    );
}
