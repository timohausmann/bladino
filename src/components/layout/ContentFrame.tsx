import clsx from 'clsx';
import { floatingSurfaceClassName } from '@/components/ui/Card';

interface ContentFrameProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared surface for master/detail routes.
 */
export function ContentFrame({
  sidebar,
  children,
  className,
}: ContentFrameProps) {
  return (
    <div
      className={clsx(
        'bg-surface border-surface-border flex h-full min-h-0 flex-1 overflow-hidden rounded-2xl border',
        floatingSurfaceClassName,
        className,
      )}
    >
      <aside className="border-line flex min-h-0 w-72 shrink-0 flex-col border-r">
        {sidebar}
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
