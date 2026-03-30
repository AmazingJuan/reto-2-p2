import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/** List / wide admin pages (same max width as decision tree). */
export const adminListShellClass = 'mx-auto w-full min-w-0 max-w-7xl space-y-4 sm:space-y-6';

export const adminFormShellClass =
    'mx-auto mt-2 w-full min-w-0 max-w-4xl space-y-4 sm:mt-6 sm:space-y-6';

export const adminFormShellNarrowClass =
    'mx-auto mt-2 w-full min-w-0 max-w-3xl space-y-4 sm:mt-6 sm:space-y-6';

/** Primary CTA — matches decision tree save / blue gradient actions. */
export const adminPrimaryButtonClass =
    'h-10 rounded-xl border-0 bg-gradient-to-b from-[#0693e3] to-[#0580c7] px-5 font-semibold text-white shadow-md shadow-[#0693e3]/35 transition hover:from-[#0588d4] hover:to-[#0470b0] hover:shadow-lg hover:shadow-[#0693e3]/30 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:text-white/90 disabled:shadow-none';

export const adminOutlineButtonClass =
    'h-10 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50';

/** Table / list card wrapper */
export const adminTableCardClass =
    'w-full min-w-0 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm [-webkit-overflow-scrolling:touch]';

export const adminFormCardClass = 'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm';

export const adminTableThClass =
    'px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6 sm:py-3';

export const adminTableThCenterClass =
    'px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6 sm:py-3';

export const adminTableTdClass = 'px-3 py-3 text-sm text-slate-900 sm:px-6 sm:py-4';

export const adminFieldLabelClass = 'mb-2 block text-sm font-semibold text-slate-800';

export const adminFormSectionTitleClass =
    'mb-4 border-b border-slate-100 pb-2 text-base font-semibold text-slate-900';

export const adminFieldInputClass =
    'block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500';

export const adminSelectFieldClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500';

type AdminPageHeaderProps = {
    icon: LucideIcon;
    title: string;
    description?: ReactNode;
    children?: ReactNode;
    className?: string;
};

export function AdminPageHeader({ icon: Icon, title, description, children, className }: AdminPageHeaderProps) {
    return (
        <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', className)}>
            <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
                    {description != null && description !== false ? (
                        typeof description === 'string' ? (
                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600">{description}</p>
                        ) : (
                            <div className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600">{description}</div>
                        )
                    ) : null}
                </div>
            </div>
            {children ? (
                <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">{children}</div>
            ) : null}
        </div>
    );
}
