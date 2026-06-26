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
          'w-full rounded-lg px-3 py-2.5 text-left transition-colors duration-150',
          active
            ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
            : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/60',
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {Icon && (
            <Icon
              size={16}
              className="shrink-0 text-neutral-400 dark:text-neutral-500"
              aria-hidden
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{title}</div>
            {meta && (
              <div className="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400">
                {meta}
              </div>
            )}
          </div>
        </div>
      </button>
    </li>
  );
}
