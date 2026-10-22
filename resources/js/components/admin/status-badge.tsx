import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const tones = {
    success: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-900 ring-amber-200',
    info: 'bg-nube text-azul-hondo ring-linea',
    neutral: 'bg-nube text-tinta ring-linea',
} as const;

export type BadgeTone = keyof typeof tones;

export function StatusBadge({ tone, children, className }: { tone: BadgeTone; children: ReactNode; className?: string }) {
    return (
        <span
            className={cn(
                'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
                tones[tone],
                className,
            )}
        >
            {children}
        </span>
    );
}

export function QuotationStatusBadge({ generated }: { generated: boolean }) {
    return generated ? <StatusBadge tone="success">Generada</StatusBadge> : <StatusBadge tone="warning">Pendiente</StatusBadge>;
}
