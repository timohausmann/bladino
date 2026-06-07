import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

interface ContextMenuLinkProps {
    id: string;
    to: string;
    label: string;
    icon?: LucideIcon;
    variant?: 'default' | 'destructive';
    disabled?: boolean;
    onClick?: () => void;
}

export function ContextMenuLink({
    id,
    to,
    label,
    icon: IconComponent,
    variant = 'default',
    disabled = false,
    onClick
}: ContextMenuLinkProps) {
    const baseClasses = "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors duration-150";

    const itemClasses = clsx(
        baseClasses,
        disabled && "text-neutral-400 dark:text-neutral-600 cursor-not-allowed",
        !disabled && variant === 'destructive' && "text-rose-600 dark:text-rose-400 hover:bg-rose-900/20 hover:text-rose-700 dark:hover:text-rose-300",
        !disabled && variant === 'default' && "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
    );

    return (
        <Link
            key={id}
            onClick={onClick}
            to={to}
            className={itemClasses}
        >
            {IconComponent && <IconComponent size={16} />}
            {label}
        </Link>
    );
}
