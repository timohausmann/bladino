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
      <aside className="border-line flex min-h-0 w-72 shrink-0 flex-col border-r">
        <div className="flex min-h-0 flex-1 flex-col">{sidebar}</div>
      </aside>
      <div className="bg-surface flex min-h-0 min-w-0 flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
