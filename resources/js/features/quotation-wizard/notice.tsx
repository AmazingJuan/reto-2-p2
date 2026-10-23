import { cn } from '@/lib/utils';
import { CircleAlert, CircleCheck } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';

type NoticeProps = { tone: 'ok' | 'error'; title: string; children?: ReactNode; role?: 'alert' | 'status' };

/** The corporate contact form's notice: a left rule, an icon and a title. It can take the focus. */
export const Notice = forwardRef<HTMLDivElement, NoticeProps>(function Notice({ tone, title, children, role }, ref) {
    const Icon = tone === 'ok' ? CircleCheck : CircleAlert;
    return (
        <div
            ref={ref}
            tabIndex={-1}
            role={role}
            className={cn(
                'grid grid-cols-[1.5rem_1fr] gap-4 rounded-control border-l-4 px-6 py-5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-azul-vivo',
                tone === 'ok' ? 'border-azul bg-nube text-tinta' : 'border-error bg-[#fbeeed]',
            )}
        >
            <Icon className={cn('h-6 w-6', tone === 'ok' ? 'text-azul' : 'text-error')} aria-hidden />
            <div>
                <p className="mb-1 font-bold">{title}</p>
                {children}
            </div>
        </div>
    );
});

export type SummaryItem = { target: string; text: string };

/**
 * "Revise 2 campos antes de continuar": every error links to its field, which
 * gets the focus and scrolls to the middle of the screen.
 */
export const ErrorSummary = forwardRef<HTMLDivElement, { items: SummaryItem[]; action: string }>(function ErrorSummary({ items, action }, ref) {
    const focus = (target: string) => {
        const element = document.getElementById(target);
        const control = element?.matches('input, textarea') ? element : element?.querySelector<HTMLElement>('input, textarea');
        control?.focus({ preventScroll: true });
        element?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };

    return (
        <Notice ref={ref} tone="error" role="alert" title={`Revise ${items.length === 1 ? 'un campo' : `${items.length} campos`} antes de ${action}`}>
            <ul className="list-disc pl-5">
                {items.map((item) => (
                    <li key={item.target}>
                        <a
                            href={`#${item.target}`}
                            onClick={(event) => {
                                event.preventDefault();
                                focus(item.target);
                            }}
                            className="font-semibold text-error underline underline-offset-[0.22em] hover:decoration-2"
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </Notice>
    );
});
