import clsx from 'clsx';

interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Two-column layout with a fixed-width sidebar and flexible main content area.
 */
export function SidebarLayout({
  sidebar,
  children,
  className,
}: SidebarLayoutProps) {
  return (
    <div className={clsx('flex min-h-0 flex-1', className)}>
      <aside className="flex min-h-0 w-72 shrink-0 flex-col border-r border-neutral-200 bg-white/50 dark:border-neutral-800 dark:bg-black/10">
        <div className="flex min-h-0 flex-1 flex-col">{sidebar}</div>
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
