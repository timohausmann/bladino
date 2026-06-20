import clsx from 'clsx';

interface SidebarLayoutProps {
    sidebar: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

/**
 * Two-column layout with a fixed-width sidebar and flexible main content area.
 */
export function SidebarLayout({ sidebar, children, className }: SidebarLayoutProps) {
    return (
        <div className={clsx('flex flex-1 min-h-0', className)}>
            <aside
                className="w-72 shrink-0 flex flex-col min-h-0 border-r border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-black/10"
            >
                <div className="flex flex-col flex-1 min-h-0">
                    {sidebar}
                </div>
            </aside>
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
                {children}
            </div>
        </div>
    );
}
