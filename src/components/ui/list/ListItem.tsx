import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';

interface ListItemProps {
    title: string;
    meta?: string;
    icon?: LucideIcon;
    active?: boolean;
    onClick?: () => void;
    className?: string;
}

/**
 * Clickable list row with title, optional meta line, and optional icon.
 */
export function ListItem({
    title,
    meta,
    icon: Icon,
    active = false,
    onClick,
    className,
}: ListItemProps) {
    return (
        <li>
            <button
                type="button"
                onClick={onClick}
                className={clsx(
                    'w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-150',
                    active
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60',
                    className,
                )}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    {Icon && (
                        <Icon
                            size={16}
                            className="shrink-0 text-neutral-400 dark:text-neutral-500"
                            aria-hidden
                        />
                    )}
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{title}</div>
                        {meta && (
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                                {meta}
                            </div>
                        )}
                    </div>
                </div>
            </button>
        </li>
    );
}
