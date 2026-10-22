import { cn } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { Eye, Pencil, Trash2, type LucideIcon } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';

const toneClass = {
    primary: 'text-azul-hondo hover:bg-nube',
    danger: 'text-error hover:bg-red-50',
    neutral: 'text-pizarra hover:bg-nube',
} as const;

const baseClass = 'inline-flex h-9 w-9 items-center justify-center rounded-control transition-colors';

/** Stops row-level click handlers from firing when an action is used. */
export function RowActions({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center justify-center gap-1" onClick={(e: MouseEvent) => e.stopPropagation()}>
            {children}
        </div>
    );
}

type ActionLinkProps = { href: string; label: string; icon: LucideIcon; tone?: keyof typeof toneClass };

export function ActionLink({ href, label, icon: Icon, tone = 'primary' }: ActionLinkProps) {
    return (
        <Link href={href} className={cn(baseClass, toneClass[tone])} title={label} aria-label={label}>
            <Icon className="h-[18px] w-[18px]" aria-hidden />
        </Link>
    );
}

export const ViewAction = ({ href, label = 'Ver detalle' }: { href: string; label?: string }) => (
    <ActionLink href={href} label={label} icon={Eye} tone="neutral" />
);

export const EditAction = ({ href }: { href: string }) => <ActionLink href={href} label="Editar" icon={Pencil} />;

/** Asks for confirmation and sends a DELETE request. */
export function DeleteAction({ href, confirmMessage }: { href: string; confirmMessage: string }) {
    const onClick = () => {
        if (window.confirm(confirmMessage)) {
            router.delete(href, { preserveScroll: true });
        }
    };

    return (
        <button type="button" onClick={onClick} className={cn(baseClass, toneClass.danger)} title="Eliminar" aria-label="Eliminar">
            <Trash2 className="h-[18px] w-[18px]" aria-hidden />
        </button>
    );
}
