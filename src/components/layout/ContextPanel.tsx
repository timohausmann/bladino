import clsx from 'clsx';

interface ContextPanelProps {
    header?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

/**
 * Route-scoped secondary panel for master-detail layouts (Notes, Email).
 * Sits between the app nav rail and the detail/content area.
 */
export function ContextPanel({ header, children, className }: ContextPanelProps) {
    return (
        <aside
            className={clsx(
                'w-72 shrink-0 flex flex-col min-h-0',
                'border-r border-neutral-200 dark:border-neutral-800',
                'bg-white/50 dark:bg-black/10',
                className,
            )}
        >
            {header}
            <div className="flex flex-col flex-1 min-h-0">{children}</div>
        </aside>
    );
}
