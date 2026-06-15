import type { PresenceEntry, PresenceRecency } from '@/components/presence';
import { mockUsers } from './users';

interface PresenceMeta {
    lastSeen: string;
    recency: PresenceRecency;
    isCurrentUser?: boolean;
}

const presenceByUserId: Record<string, PresenceMeta> = {
    'user-2': { lastSeen: 'gerade eben', recency: 'fresh', isCurrentUser: true },
    'user-1': { lastSeen: 'vor 4 h', recency: 'recent' },
    'user-3': { lastSeen: 'vor 6 h', recency: 'recent' },
    'user-6': { lastSeen: 'vor 3 W', recency: 'older' },
    'user-9': { lastSeen: 'vor 2 M.', recency: 'stale' },
};

const presenceUserIds = Object.keys(presenceByUserId);

function toPresenceEntry(userId: string): PresenceEntry | null {
    const user = mockUsers.find((entry) => entry.id === userId);
    const meta = presenceByUserId[userId];

    if (!user || !meta) return null;

    return {
        id: `presence-${user.id}`,
        name: user.name,
        handle: user.handle,
        avatar: user.avatar,
        lastSeen: meta.lastSeen,
        recency: meta.recency,
        isCurrentUser: meta.isCurrentUser,
    };
}

export const mockPresenceEntries: PresenceEntry[] = presenceUserIds
    .map(toPresenceEntry)
    .filter((entry): entry is PresenceEntry => entry !== null);
