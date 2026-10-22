import { cn } from '@/lib/utils';

/**
 * The only logo file is a 164×93 PNG (same as the corporate site). `inverse`
 * renders it as a single-ink negative for navy grounds.
 */
export function BrandLogo({ inverse = false, className }: { inverse?: boolean; className?: string }) {
    return (
        <img
            src="/logo_training.png"
            width={164}
            height={93}
            alt="Training Corporation"
            decoding="async"
            className={cn('block h-auto w-[7.5rem] lg:w-[8.5rem]', inverse && 'brightness-0 invert', className)}
        />
    );
}
