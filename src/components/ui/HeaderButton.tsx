import clsx from 'clsx';
import { ReactNode } from 'react';

interface HeaderButtonProps {
    onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
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
 */
export function HeaderButton({
    onClick,
    icon,
    label,
    title,
    className = '',
    active = false,
    variant = 'default'
}: HeaderButtonProps) {
    return (
        <button
            onClick={onClick}
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
            title={title || label}
        >
            {icon}
        </button>
    );
}
