import { navRailIconColumnClassName } from '@/components/layout/navRailLayout';
import clsx from 'clsx';

interface NavRailIconTrackProps {
  children: React.ReactNode;
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
