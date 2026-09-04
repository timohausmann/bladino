import { NavigationCountBadge } from '@/components/navigation/NavigationCountBadge';
import { NavRailIconTrack } from '@/components/navigation/NavRailIconTrack';
import {
  navRailLabelClassName,
  navRailRowClassName,
} from '@/components/navigation/navRailLayout';
import { Tooltip } from '@/components/ui/Tooltip';
import { Link } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';

interface NavRailLinkProps {
  to: string;
  params?: Record<string, string>;
  label: string;
  icon: LucideIcon;
  expanded: boolean;
  disabled?: boolean;
  exact?: boolean;
  count?: number;
}

/**
 * Navigation link — always uses the shared icon column so alignment matches in both rail states.
 */
export function NavRailLink({
  to,
  params,
  label,
  icon: Icon,
  expanded,
  disabled = false,
  exact = false,
  count = 0,
}: NavRailLinkProps) {
  const inactiveClassName = navRailRowClassName({ disabled });
  const activeClassName = navRailRowClassName({ active: true, disabled });

  const content = (
    <>
      <NavRailIconTrack className="relative">
        <Icon size={20} aria-hidden className="shrink-0" />
        {!expanded && count > 0 ? (
          <span className="pointer-events-none absolute -top-1 right-1">
            <NavigationCountBadge count={count} />
          </span>
        ) : null}
      </NavRailIconTrack>
      {expanded ? (
        <>
          <span className={navRailLabelClassName}>{label}</span>
          <NavigationCountBadge count={count} className="mr-2" />
        </>
      ) : null}
    </>
  );

  if (disabled) {
    const item = (
      <div className={inactiveClassName} aria-disabled aria-label={label}>
        {content}
      </div>
    );

    return expanded ? item : <Tooltip content={label}>{item}</Tooltip>;
  }

  const link = (
    <Link
      to={to}
      params={params}
      aria-label={label}
      activeOptions={{ exact }}
      className={inactiveClassName}
      activeProps={{ className: activeClassName }}
      inactiveProps={{ className: inactiveClassName }}
    >
      {content}
    </Link>
  );

  return expanded ? link : <Tooltip content={label}>{link}</Tooltip>;
}
