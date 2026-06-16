import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { useUiStore } from '@/stores/uiStore';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

export type PresenceRecency = 'fresh' | 'recent' | 'older' | 'stale';

export interface PresenceEntry {
    id: string;
    name: string;
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
    const { name, avatar, lastSeen, recency = 'recent', isCurrentUser } = entry;

    return (
        <Link
            to="/u/$name"
            params={{ name }}
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
                    avatar={avatar}
                    alt={`${name}'s avatar`}
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
    const isPresenceRailOpen = useUiStore((store) => store.isPresenceRailOpen);
    const setPresenceRailOpen = useUiStore((store) => store.setPresenceRailOpen);

    if (entries.length === 0) return null;

    const activeCount = entries.filter(
        (entry) => entry.recency && ['fresh', 'recent'].includes(entry.recency),
    ).length;

    return (
        <Card className="py-4 px-4">
            <Collapsible.Root
                open={isPresenceRailOpen}
                onOpenChange={setPresenceRailOpen}
            >
                <Collapsible.Trigger asChild>
                    <button
                        type="button"
                        className={clsx([
                            'group flex w-full items-center justify-between gap-3',
                            'text-left cursor-pointer',
                        ])}
                        aria-label={isPresenceRailOpen ? 'Collapse recently online' : 'Expand recently online'}
                    >
                        <h2 className="text-sm font-semibold text-foreground">
                            Recently online
                        </h2>

                        <span className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-muted-foreground">
                                {activeCount} active
                            </span>
                            <ChevronDown
                                size={16}
                                className={clsx([
                                    'text-muted-foreground',
                                    'transition-transform duration-200',
                                    'group-data-[state=open]:rotate-180',
                                ])}
                                aria-hidden
                            />
                        </span>
                    </button>
                </Collapsible.Trigger>

                <Collapsible.Content
                    className={clsx([
                        'overflow-hidden',
                        'data-[state=open]:animate-[radixCollapsibleSlideDown_300ms_ease-out]',
                        'data-[state=closed]:animate-[radixCollapsibleSlideUp_300ms_ease-out]',
                        'will-change-[height]',
                    ])}
                >
                    <div
                        className={clsx([
                            'flex gap-4 overflow-x-auto',
                            'py-1.5 px-1 pt-4',
                        ])}
                    >
                        {entries.map((entry) => (
                            <PresenceRailItem key={entry.id} entry={entry} />
                        ))}
                    </div>
                </Collapsible.Content>
            </Collapsible.Root>
        </Card>
    );
}
