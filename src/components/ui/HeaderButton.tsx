import clsx from 'clsx';
import { ReactNode } from 'react';

interface HeaderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;
    label: string;
    title?: string;
    className?: string;
    active?: boolean;
    variant?: 'default' | 'persistent';
}

/**
 * HeaderButton - A reusable button component for header actions
 * Supports two variants:
 * - default: Transparent background with hover effects
 * - persistent: Always has background with enhanced hover effects
 * 
 * Extends all native button props for compatibility with Radix components
 */
export function HeaderButton({
    icon,
    label,
    className = '',
    active = false,
    variant = 'default',
    ...buttonProps
}: HeaderButtonProps) {
    return (
        <button
            {...buttonProps}
            className={clsx(
                // Base styles
                'border-none cursor-pointer flex items-center justify-center text-foreground w-10 h-10 rounded-full p-0 transition-colors',

                // Variant-specific styles
                variant === 'default' && [
                    'bg-transparent hover:bg-black/10 dark:hover:bg-white/10',
                    active && 'bg-white/10 dark:bg-white/10'
                ],

                variant === 'persistent' && [
                    'bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20',
                    active && 'bg-white/50 dark:bg-white/20'
                ],

                className
            )}
            aria-label={label}
        >
            {icon}
        </button>
    );
}
