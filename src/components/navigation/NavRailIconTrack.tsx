import { navRailIconColumnClassName } from '@/components/navigation/navRailLayout';
import clsx from 'clsx';
import type { ReactNode } from 'react';

interface NavRailIconTrackProps {
  children: ReactNode;
  className?: string;
}

/** Fixed 44px icon column — icons centered, same x-position collapsed and expanded. */
export function NavRailIconTrack({
  children,
  className,
}: NavRailIconTrackProps) {
  return (
    <span className={clsx(navRailIconColumnClassName, className)}>
      {children}
    </span>
  );
}
