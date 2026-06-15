import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';

export type PresenceRecency = 'fresh' | 'recent' | 'older' | 'stale';

export interface PresenceEntry {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    lastSeen: string;
    recency?: PresenceRecency;
    isCurrentUser?: boolean;
}

export interface PresenceRailProps {
    entries: PresenceEntry[];
}

interface PresenceRailItemProps {
    entry: PresenceEntry;
}

const recencyBorderClass: Record<PresenceRecency, string> = {
    fresh: 'border-2 border-cyan-500/80 dark:border-cyan-400/70',
    recent: 'border-2 border-foreground/15 dark:border-white/20',
    older: 'border border-foreground/10 dark:border-white/10',
    stale: 'border border-foreground/5 dark:border-white/5',
};

function PresenceRailItem({ entry }: PresenceRailItemProps) {
    const { name, handle, avatar, lastSeen, recency = 'recent', isCurrentUser } = entry;

    return (
        <Link
            to="/u/$handle"
            params={{ handle }}
            className="flex flex-col items-center shrink-0 w-20 no-underline"
        >
            <div
                className={clsx([
                    'rounded-full mb-2',
                    isCurrentUser
                        ? 'border-2 border-cyan-500/80 dark:border-cyan-400/70'
                        : recencyBorderClass[recency],
                ])}
            >
                <Avatar
                    src={avatar}
                    alt={`${name}s Avatar`}
                    className="w-12 h-12"
                />
            </div>

            <div className="flex flex-col items-center gap-0 w-full">
                <span className="text-sm font-semibold leading-tight text-center truncate w-full">
                    {name}
                </span>

                <span className="text-xs text-muted-foreground leading-tight text-center truncate w-full">
                    {lastSeen}
                </span>
            </div>
        </Link>
    );
}

export function PresenceRail({ entries }: PresenceRailProps) {
    if (entries.length === 0) return null;
    const activeCount = entries.filter(entry => entry.recency && ['fresh', 'recent'].includes(entry.recency)).length;

    return (
        <Card className="py-4 px-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-sm font-semibold text-foreground">
                        Recently online
                    </h2>
                    <span className="text-xs text-muted-foreground shrink-0">
                        {activeCount} active
                    </span>
                </div>

                <div
                    className={clsx([
                        'flex gap-4 overflow-x-auto',
                        'py-1.5 px-1'
                    ])}
                >
                    {entries.map((entry) => (
                        <PresenceRailItem key={entry.id} entry={entry} />
                    ))}
                </div>
            </div>
        </Card>
    );
}
