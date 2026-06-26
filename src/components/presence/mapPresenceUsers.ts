import type { UsersLastActionQuery } from '@/graphql';
import type { ApiDate } from '@/utils/formatDate';
import type { PresenceEntry } from './PresenceRail';

const MS_HOUR = 60 * 60 * 1000;
const MS_DAY = 24 * MS_HOUR;
const MS_WEEK = 7 * MS_DAY;
const SHOW_TIME_WITHIN_MS = 4 * MS_WEEK;

function parseLastAction(lastAction: ApiDate): Date | null {
  if (!lastAction) {
    return null;
  }

  const parsed = new Date(lastAction);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Formats lastAction for users seen within the last 4 weeks. */
export function formatLastSeen(lastAction: ApiDate): string {
  const parsed = parseLastAction(lastAction);
  if (!parsed) {
    return '';
  }

  const ageMs = Date.now() - parsed.getTime();
  if (ageMs >= SHOW_TIME_WITHIN_MS) {
    return '';
  }

  const ageSec = Math.max(0, Math.floor(ageMs / 1000));

  if (ageSec < 60) return 'just now';

  const ageMin = Math.floor(ageSec / 60);
  if (ageMin < 60) return `${ageMin}m ago`;

  const ageHours = Math.floor(ageMin / 60);
  if (ageHours < 24) return `${ageHours}h ago`;

  const ageDays = Math.floor(ageHours / 24);
  if (ageDays < 7) return `${ageDays}d ago`;

  const ageWeeks = Math.floor(ageDays / 7);
  return `${ageWeeks}w ago`;
}

export function mapUsersToPresenceEntries(
  users: UsersLastActionQuery['usersLastAction'],
): PresenceEntry[] {
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    avatar: user.avatar ?? '',
    lastSeen: formatLastSeen(user.lastAction),
  }));
}
