import { NavRailIconTrack } from '@/components/layout/NavRailIconTrack';
import {
  navRailLabelClassName,
  navRailRowClassName,
} from '@/components/layout/navRailLayout';
import { useUserStore } from '@/stores/userStore';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { Avatar } from '@/components/ui/Avatar';

interface InteractiveAvatarProps {
  className?: string;
  showName?: boolean;
}

/**
 * Profile link for the nav rail — avatar (+ optional name) links to the current user's profile.
 */
export function InteractiveAvatar({
  className,
  showName = false,
}: InteractiveAvatarProps) {
  const currentUser = useUserStore((store) => store.currentUser);

  if (!currentUser) {
    return null;
  }

  const inactiveClassName = navRailRowClassName();
  const activeClassName = navRailRowClassName({ active: true });

  return (
    <Link
      to="/u/$name"
      params={{ name: currentUser.name }}
      title={showName ? undefined : currentUser.name}
      aria-label={`Profile: ${currentUser.name}`}
      className={inactiveClassName}
      activeProps={{ className: activeClassName }}
      inactiveProps={{ className: inactiveClassName }}
    >
      <NavRailIconTrack>
        <Avatar
          avatar={currentUser.avatar}
          alt={currentUser.name}
          className={clsx('h-8 w-8 shrink-0', className)}
        />
      </NavRailIconTrack>
      {showName ? (
        <span className={navRailLabelClassName}>{currentUser.name}</span>
      ) : null}
    </Link>
  );
}
