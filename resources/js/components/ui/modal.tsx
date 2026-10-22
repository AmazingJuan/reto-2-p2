import { cn } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

type ModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
};

/** Accessible dialog: focus trap, Escape to close, scroll lock, labelled. */
export function Modal({ open, onOpenChange, title, description, icon, children, className }: ModalProps) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="data-[state=open]:animate-fade-in fixed inset-0 z-50 bg-noche/50 backdrop-blur-[2px]" />
                <Dialog.Content
                    className={cn(
                        'fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-tinta/10 sm:p-8',
                        className,
                    )}
                >
                    <div className="mb-6 flex items-start gap-3 pr-8">
                        {icon}
                        <div className="min-w-0">
                            <Dialog.Title className="text-xl font-bold tracking-tight text-tinta">{title}</Dialog.Title>
                            {description ? (
                                <Dialog.Description className="mt-1 text-sm leading-relaxed text-pizarra">{description}</Dialog.Description>
                            ) : (
                                <Dialog.Description className="sr-only">{title}</Dialog.Description>
                            )}
                        </div>
                    </div>
                    {children}
                    <Dialog.Close
                        className="absolute right-4 top-4 rounded-control p-1.5 text-pizarra transition-colors hover:bg-nube hover:text-tinta"
                        aria-label="Cerrar"
                    >
                        <X className="h-5 w-5" aria-hidden />
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
