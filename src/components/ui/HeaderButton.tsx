import clsx from 'clsx';
import { ReactNode } from 'react';

interface HeaderButtonProps {
    onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    icon: ReactNode;
    label: string;
    title?: string;
    className?: string;
    active?: boolean;
}

/**
 * HeaderButton - A reusable button component for header actions
 */
export function HeaderButton({
    onClick,
    icon,
    label,
    title,
    className = '',
    active = false
}: HeaderButtonProps) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                'bg-transparent border-none cursor-pointer flex items-center justify-center text-foreground w-10 h-10 rounded-full p-0 hover:bg-black/10 dark:hover:bg-white/10 transition-colors',
                active && 'bg-white/10 dark:bg-white/10',
                className
            )}
            aria-label={label}
            title={title || label}
        >
            {icon}
        </button>
    );
}
