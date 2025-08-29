import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

interface ContextMenuButtonProps {
    id: string;
    label: string;
    icon?: LucideIcon;
    variant?: 'default' | 'destructive';
    disabled?: boolean;
    onClick: () => void;
}

export function ContextMenuButton({
    id,
    label,
    icon: IconComponent,
    variant = 'default',
    disabled = false,
    onClick
}: ContextMenuButtonProps) {
    const baseClasses = "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors duration-150";

    const itemClasses = clsx(
        baseClasses,
        disabled && "text-neutral-400 dark:text-neutral-600 cursor-not-allowed",
        !disabled && variant === 'destructive' && "text-red-600 dark:text-red-400 hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300",
        !disabled && variant === 'default' && "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
    );

    return (
        <button
            key={id}
            onClick={onClick}
            className={itemClasses}
            disabled={disabled}
        >
            {IconComponent && <IconComponent size={16} />}
            {label}
        </button>
    );
}
