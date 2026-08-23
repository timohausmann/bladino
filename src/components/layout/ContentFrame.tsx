import clsx from 'clsx';
import { floatingSurfaceClassName } from '@/components/ui/Card';

interface ContentFrameProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared card-like surface for dense master/detail routes.
 */
export function ContentFrame({ children, className }: ContentFrameProps) {
  return (
    <div
      className={clsx(
        'bg-surface border-surface-border flex h-full min-h-0 flex-1 overflow-hidden rounded-2xl border',
        floatingSurfaceClassName,
        className,
      )}
    >
      {children}
    </div>
  );
}
