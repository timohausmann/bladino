import { Avatar } from '@/components/ui/Avatar';
import type { UsersLastActionQuery } from '@/graphql';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { mapUsersToPresenceEntries } from '@/components/presence/mapPresenceUsers';
import type { PresenceEntry } from '@/components/presence/PresenceRail';
import { DashboardWidget } from '../DashboardWidget';

interface PresenceListItemProps {
  entry: PresenceEntry;
}

function PresenceListItem({ entry }: PresenceListItemProps) {
  const { t } = useTranslation();
  const { name, avatar, lastSeen } = entry;

  return (
    <Link
      to="/u/$name"
      params={{ name }}
      className="hover:bg-muted/50 flex items-center gap-3 rounded-lg px-2 py-2 no-underline transition-colors"
    >
      <Avatar
        avatar={avatar}
        alt={t('common:userAvatar', { name })}
        className="h-10 max-h-[50px] w-10 max-w-[50px] shrink-0"
      />

      <div className="min-w-0 flex-1">
        <span className="text-foreground block truncate text-sm font-semibold">
          {name}
        </span>
        {lastSeen && (
          <span className="text-muted-foreground block truncate text-xs">
            {lastSeen}
          </span>
        )}
      </div>
    </Link>
  );
}

interface CommunityWidgetProps {
  users?: UsersLastActionQuery['usersLastAction'];
}

/**
 * Vertical community presence list for the dashboard.
 */
export function CommunityWidget({ users = [] }: CommunityWidgetProps) {
  const { t, i18n } = useTranslation();

  const entries = useMemo(
    () => mapUsersToPresenceEntries(users),
    [users, i18n.language],
  );

  return (
    <DashboardWidget title={t('presence:community')}>
      {entries.length === 0 ? (
        <p className="text-muted-foreground py-4 text-center text-sm">
          {t('dashboard:communityEmpty')}
        </p>
      ) : (
        <ul className="flex flex-col gap-0.5">
          {entries.map((entry) => (
            <li key={entry.id}>
              <PresenceListItem entry={entry} />
            </li>
          ))}
        </ul>
      )}
    </DashboardWidget>
  );
}
