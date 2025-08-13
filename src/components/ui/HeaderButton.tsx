import { ReactNode } from 'react';

interface HeaderButtonProps {
    onClick: () => void;
    icon: ReactNode;
    label: string;
    title?: string;
    className?: string;
}

/**
 * HeaderButton - A reusable button component for header actions
 */
export function HeaderButton({
    onClick,
    icon,
    label,
    title,
    className = ''
}: HeaderButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`bg-transparent border-none cursor-pointer flex items-center justify-center text-foreground w-10 h-10 rounded-full p-0 hover:bg-white/10 dark:hover:bg-white/5 transition-colors ${className}`}
            aria-label={label}
            title={title || label}
        >
            {icon}
        </button>
    );
}
