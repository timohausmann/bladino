import clsx from 'clsx';
import type { ReactNode } from 'react';

interface TimelineDividerProps {
  children: ReactNode;
  className?: string;
}

/** Centered label that separates sections in a timeline feed. */
export function TimelineDivider({ children, className }: TimelineDividerProps) {
  return (
    <div
      role="separator"
      className={clsx('text-muted-foreground text-center text-xs', className)}
    >
      {children}
    </div>
  );
}
