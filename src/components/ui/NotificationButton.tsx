import { NavRailIconTrack } from '@/components/layout/NavRailIconTrack';
import {
  navRailLabelClassName,
  navRailRowClassName,
} from '@/components/layout/navRailLayout';
import { Tooltip } from '@/components/ui/Tooltip';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NotificationButtonProps {
  count?: number;
  expanded?: boolean;
}

function formatCount(count: number): string {
  return count > 99 ? '99+' : String(count);
}

function CountBadge({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  if (count <= 0) {
    return null;
  }

  return (
    <span
      className={clsx(
        'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-0.5',
        'bg-cyan-300 text-[10px] font-medium text-black tabular-nums text-shadow-2xs',
        className,
      )}
    >
      {formatCount(count)}
    </span>
  );
}

/**
 * Notifications entry — shared icon column row, navigates to /notifications.
 */
export function NotificationButton({
  count = 0,
  expanded = false,
}: NotificationButtonProps) {
  const { t } = useTranslation();
  const inactiveClassName = navRailRowClassName();
  const activeClassName = navRailRowClassName({ active: true });
  const label = t('notifications:title');

  const link = (
    <Link
      to="/notifications"
      aria-label={label}
      className={inactiveClassName}
      activeProps={{ className: activeClassName }}
      inactiveProps={{ className: inactiveClassName }}
    >
      <NavRailIconTrack className="relative">
        <Bell size={20} aria-hidden className="shrink-0" />
        {!expanded && count > 0 ? (
          <span className="pointer-events-none absolute -top-1 right-1">
            <CountBadge
              count={count}
              className="h-4 min-w-4 px-1 text-[10px]"
            />
          </span>
        ) : null}
      </NavRailIconTrack>
      {expanded ? (
        <>
          <span className={navRailLabelClassName}>{label}</span>
          <CountBadge count={count} className="mr-2" />
        </>
      ) : null}
    </Link>
  );

  return expanded ? link : <Tooltip content={label}>{link}</Tooltip>;
}
