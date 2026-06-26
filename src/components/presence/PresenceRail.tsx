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
      className="flex shrink-0 flex-col items-center no-underline"
    >
      <Avatar
        avatar={avatar}
        alt={`${name}'s avatar`}
        className="mb-2 h-12 w-12"
      />

      <div className="flex w-full flex-col items-center gap-0">
        <span className="w-full truncate text-center text-sm leading-tight font-semibold">
          {name}
        </span>

        {lastSeen && (
          <span className="text-muted-foreground w-full truncate text-center text-xs leading-tight">
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
    <Card className="px-4 py-4">
      <Collapsible.Root
        open={isPresenceRailOpen}
        onOpenChange={setPresenceRailOpen}
      >
        <Collapsible.Trigger asChild>
          <button
            type="button"
            className={clsx([
              'group flex w-full items-center justify-between gap-3',
              'cursor-pointer text-left',
            ])}
            aria-label={
              isPresenceRailOpen ? 'Collapse community' : 'Expand community'
            }
          >
            <h2 className="text-foreground text-sm font-semibold">Community</h2>

            <span className="flex shrink-0 items-center gap-2">
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
