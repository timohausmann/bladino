import { InteractiveAvatar } from '@/components/ui/InteractiveAvatar';
import {
  getMockNotifications,
  getUnreadNotificationCount,
} from '@/lib/mockNotifications';
import { NotificationButton } from '@/components/ui/NotificationButton';
import { NavRailIconLink } from '@/components/layout/NavRailIconLink';
import { NavRailIconTrack } from '@/components/layout/NavRailIconTrack';
import { NavRailLink } from '@/components/layout/NavRailLink';
import { NavigationCountBadge } from '@/components/layout/NavigationCountBadge';
import {
  navRailLabelClassName,
  navRailRowClassName,
  navRailSectionClassName,
} from '@/components/layout/navRailLayout';
import { useUiStore } from '@/stores/uiStore';
import {
  UnreadOverviewDocument,
  useGraphQLQuery,
  type UnreadOverviewQuery,
} from '@/graphql';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import {
  ChevronDown,
  Compass,
  Hash,
  LayoutDashboard,
  Mail,
  Rss,
  Settings,
  StickyNote,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AppNavigationProps {
  expanded: boolean;
}

/**
 * Shared navigation body for the desktop rail and the mobile drawer.
 */
export function AppNavigation({ expanded }: AppNavigationProps) {
  const { t } = useTranslation();
  const { data: unreadData, isLoading: isUnreadLoading } = useGraphQLQuery(
    UnreadOverviewDocument,
  );
  const unreadOverview = unreadData?.unreadOverview;
  const unreadNotificationCount = getUnreadNotificationCount(
    getMockNotifications(t),
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <nav
        className={clsx(
          'flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain py-3',
          navRailSectionClassName,
        )}
      >
        <NavRailLink
          to="/"
          label={t('navigation:dashboard')}
          icon={LayoutDashboard}
          expanded={expanded}
          exact
        />
        <NavRailLink
          to="/feed"
          label={t('navigation:feed')}
          icon={Rss}
          expanded={expanded}
          count={unreadOverview?.feed.unreadCount}
        />
        <NotificationButton
          count={unreadNotificationCount}
          expanded={expanded}
        />
        <NavRailLink
          to="/explore"
          label={t('navigation:explore')}
          icon={Compass}
          expanded={expanded}
          disabled
        />
        <AppNavigationChannels
          expanded={expanded}
          channels={unreadOverview?.channels ?? []}
          isLoading={isUnreadLoading}
        />
      </nav>

      <div
        className={clsx(
          'flex shrink-0 flex-col gap-1 pb-2',
          navRailSectionClassName,
        )}
      >
        <div className="flex shrink-0 flex-col gap-1 pb-2">
          <NavRailLink
            to="/notes"
            label={t('navigation:notes')}
            icon={StickyNote}
            expanded={expanded}
          />
          <NavRailLink
            to="/mails"
            label={t('navigation:mail')}
            icon={Mail}
            expanded={expanded}
          />
        </div>
        {expanded ? (
          <div className="flex w-full items-center gap-1">
            <div className="min-w-0 flex-1">
              <InteractiveAvatar showName />
            </div>
            <NavRailIconLink
              to="/settings"
              label={t('navigation:settings')}
              icon={Settings}
            />
          </div>
        ) : (
          <>
            <NavRailLink
              to="/settings"
              label={t('navigation:settings')}
              icon={Settings}
              expanded={false}
            />
            <InteractiveAvatar showName={false} />
          </>
        )}
      </div>
    </div>
  );
}

interface AppNavigationChannelsProps {
  expanded: boolean;
  channels: UnreadOverviewQuery['unreadOverview']['channels'];
  isLoading: boolean;
}

function AppNavigationChannels({
  expanded,
  channels,
  isLoading,
}: AppNavigationChannelsProps) {
  const { t } = useTranslation();
  const isChannelsSectionOpen = useUiStore(
    (store) => store.isChannelsSectionOpen,
  );
  const setChannelsSectionOpen = useUiStore(
    (store) => store.setChannelsSectionOpen,
  );

  if (!expanded) {
    return (
      <NavRailLink
        to="/channels"
        label={t('navigation:channels')}
        icon={Hash}
        expanded={false}
      />
    );
  }

  return (
    <Collapsible.Root
      open={isChannelsSectionOpen}
      onOpenChange={setChannelsSectionOpen}
      className="flex shrink-0 flex-col gap-1"
    >
      <Collapsible.Trigger className={clsx(navRailRowClassName(), 'group')}>
        <NavRailIconTrack>
          <Hash size={20} aria-hidden className="shrink-0" />
        </NavRailIconTrack>
        <span className={navRailLabelClassName}>
          {t('navigation:channels')}
        </span>
        <ChevronDown
          size={16}
          aria-hidden
          className="mr-2 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </Collapsible.Trigger>
      <Collapsible.Content className="flex flex-col gap-0.5 pr-0.5 pb-1 pl-11">
        {isLoading ? (
          <p className="px-2 py-2 text-sm text-neutral-400 dark:text-neutral-600">
            {t('channels:loading')}
          </p>
        ) : channels.length === 0 ? (
          <p className="px-2 py-2 text-sm text-neutral-400 dark:text-neutral-600">
            {t('channels:empty')}
          </p>
        ) : (
          channels.map(({ channel, unreadCount }) => (
            <Link
              key={channel.id}
              to="/channels/$id"
              params={{ id: channel.id }}
              title={`#${channel.name}`}
              className={clsx(
                'flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors duration-150',
                'text-neutral-600 hover:bg-black/10 hover:text-neutral-900',
                'dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-neutral-100',
              )}
              activeProps={{
                className: clsx(
                  'flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors duration-150',
                  'bg-black/5 text-black dark:bg-white/5 dark:text-white',
                ),
              }}
            >
              <span className="min-w-0 flex-1 truncate">#{channel.name}</span>
              <NavigationCountBadge
                count={unreadCount}
                className="h-5 min-w-5 px-1.5 text-xs"
              />
            </Link>
          ))
        )}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
