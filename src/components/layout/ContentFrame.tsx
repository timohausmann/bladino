import clsx from 'clsx';
import { floatingSurfaceClassName } from '@/components/ui/Card';

interface ContentFrameProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  mobilePane: 'sidebar' | 'content';
  className?: string;
}

/**
 * Shared surface for master/detail routes.
 */
export function ContentFrame({
  sidebar,
  children,
  mobilePane,
  className,
}: ContentFrameProps) {
  return (
    <div
      className={clsx(
        'bg-surface border-surface-border flex h-full min-h-0 flex-1 overflow-hidden border-0',
        'rounded-none lg:rounded-2xl lg:border',
        floatingSurfaceClassName,
        className,
      )}
    >
      <aside
        className={clsx(
          'border-line min-h-0 w-full flex-1 flex-col',
          'lg:flex lg:w-72 lg:flex-none lg:shrink-0 lg:border-r',
          mobilePane === 'sidebar' ? 'flex' : 'hidden',
        )}
      >
        {sidebar}
      </aside>
      <div
        className={clsx(
          'min-h-0 w-full min-w-0 flex-1 flex-col',
          'lg:flex',
          mobilePane === 'content' ? 'flex' : 'hidden',
        )}
      >
        {children}
      </div>
    </div>
  );
}
