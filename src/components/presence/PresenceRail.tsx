import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import type { UsersLastActionQuery } from '@/graphql';
import { useUiStore } from '@/stores/uiStore';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useMemo } from 'react';
import { mapUsersToPresenceEntries } from './mapPresenceUsers';

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
    users: UsersLastActionQuery['usersLastAction'];
}

interface PresenceRailItemProps {
    entry: PresenceEntry;
}

function PresenceRailItem({ entry }: PresenceRailItemProps) {
    const { name, avatar, lastSeen } = entry;

    return (
        <Link
            to="/u/$name"
            params={{ name }}
            className="flex flex-col items-center shrink-0 no-underline"
        >
            <Avatar
                avatar={avatar}
                alt={`${name}'s avatar`}
                className="w-12 h-12 mb-2"
            />

            <div className="flex flex-col items-center gap-0 w-full">
                <span className="text-sm font-semibold leading-tight text-center truncate w-full">
                    {name}
                </span>

                {lastSeen && (
                    <span className="text-xs text-muted-foreground leading-tight text-center truncate w-full">
                        {lastSeen}
                    </span>
                )}
            </div>
        </Link>
    );
}

export function PresenceRail({ users = [] }: PresenceRailProps) {
    const isPresenceRailOpen = useUiStore((store) => store.isPresenceRailOpen);
    const setPresenceRailOpen = useUiStore((store) => store.setPresenceRailOpen);

    const entries = useMemo(() => mapUsersToPresenceEntries(users), [users]);

    if (entries.length === 0) return null;

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
                        aria-label={isPresenceRailOpen ? 'Collapse community' : 'Expand community'}
                    >
                        <h2 className="text-sm font-semibold text-foreground">
                            Community
                        </h2>

                        <span className="flex items-center gap-2 shrink-0">
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
                            'flex items-start gap-6 overflow-x-auto',
                            'px-1 py-4',
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
