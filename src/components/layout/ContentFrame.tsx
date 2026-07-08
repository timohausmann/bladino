import clsx from 'clsx';

interface ContentFrameProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Route-sized surface for dense app views.
 */
export function ContentFrame({ children, className }: ContentFrameProps) {
  return (
    <div
      className={clsx('flex h-full min-h-0 flex-1 overflow-hidden', className)}
    >
      {children}
    </div>
  );
}
