import type { PresenceEntry, PresenceRecency } from '@/components/presence';
import { mockUsers } from './users';

interface PresenceMeta {
    lastSeen: string;
    recency: PresenceRecency;
    isCurrentUser?: boolean;
}

const presenceByUserId: Record<string, PresenceMeta> = {
    'user-2': { lastSeen: 'just now', recency: 'fresh', isCurrentUser: true },
    'user-1': { lastSeen: '4h ago', recency: 'recent' },
    'user-3': { lastSeen: '6h ago', recency: 'recent' },
    'user-6': { lastSeen: '3w ago', recency: 'older' },
    'user-9': { lastSeen: '2mo ago', recency: 'stale' },
};

const presenceUserIds = Object.keys(presenceByUserId);

function toPresenceEntry(userId: string): PresenceEntry | null {
    const user = mockUsers.find((entry) => entry.id === userId);
    const meta = presenceByUserId[userId];

    if (!user || !meta) return null;

    return {
        id: `presence-${user.id}`,
        name: user.name,
        avatar: user.avatar ?? '',
        lastSeen: meta.lastSeen,
        recency: meta.recency,
        isCurrentUser: meta.isCurrentUser,
    };
}

export const mockPresenceEntries: PresenceEntry[] = presenceUserIds
    .map(toPresenceEntry)
    .filter((entry): entry is PresenceEntry => entry !== null);
