import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { Divider } from '@/components/ui/Divider';
import { InteractiveAvatar } from '@/components/ui/InteractiveAvatar';
import { NotificationButton } from '@/components/ui/NotificationButton';
import { NavRailIconTrack } from '@/components/layout/NavRailIconTrack';
import { NavRailIconLink } from '@/components/layout/NavRailIconLink';
import { NavRailLink } from '@/components/layout/NavRailLink';
import {
  NAV_RAIL_COLLAPSED_WIDTH,
  NAV_RAIL_EXPANDED_WIDTH,
  navRailLabelClassName,
  navRailRowClassName,
  navRailSectionClassName,
} from '@/components/layout/navRailLayout';
import { ChannelsDocument, useGraphQLQuery } from '@/graphql';
import { useUiStore } from '@/stores/uiStore';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import {
  ChevronDown,
  Compass,
  Hash,
  LayoutDashboard,
  Mail,
  PanelLeftOpen,
  PanelLeftClose,
  Rss,
  Settings,
  StickyNote,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Persistent left navigation rail for authenticated routes.
 */
export function NavRail() {
  const { t } = useTranslation();
  const mockNotifications = [
    {
      id: '1',
      message: t('notifications:mock.likedPost', { name: 'Jane Smith' }),
      isNew: true,
      timestamp: t('notifications:mock.minutesAgo', { count: 2 }),
    },
    {
      id: '2',
      message: t('notifications:mock.newComment'),
      isNew: true,
      timestamp: t('notifications:mock.minutesAgo', { count: 5 }),
    },
    {
      id: '3',
      message: t('notifications:mock.newFollower'),
      isNew: false,
      timestamp: t('notifications:mock.hourAgo'),
    },
  ];
  const expanded = useUiStore((store) => store.isNavRailExpanded);
  const toggleNavRail = useUiStore((store) => store.toggleNavRail);

  return (
    <aside
      className={clsx(
        'sticky top-0 flex h-dvh min-h-dvh shrink-0 flex-col',
        'border-r border-neutral-200 dark:border-neutral-800',
        'bg-white/50 backdrop-blur-sm dark:bg-black/10',
        'transition-[width] duration-300 ease-in-out',
        expanded ? NAV_RAIL_EXPANDED_WIDTH : NAV_RAIL_COLLAPSED_WIDTH,
      )}
    >
      {/* Header */}
      <div className={clsx('shrink-0 py-3', navRailSectionClassName)}>
        <div className="flex flex-col gap-1">
          <div className={navRailRowClassName({ noHover: true })}>
            {expanded ? (
              <Link to="/" aria-label={t('navigation:dashboard')}>
                <AnimatedLogo
                  className="mx-2 block min-w-4 shrink-0"
                  logoHeight="2rem"
                />
              </Link>
            ) : (
              <NavRailIconTrack>
                <Link to="/" aria-label={t('navigation:dashboard')}>
                  <img
                    src="/icon-trashnet-2026.svg"
                    alt="trashnet"
                    className="block h-8 w-8 shrink-0"
                  />
                </Link>
              </NavRailIconTrack>
            )}
            {expanded ? (
              <button
                type="button"
                onClick={toggleNavRail}
                className={clsx(
                  'ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  'text-neutral-600 hover:bg-black/10 hover:text-neutral-900',
                  'dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-neutral-100',
                  'transition-colors duration-150',
                )}
                aria-label={t('navigation:collapseNavigation')}
              >
                <PanelLeftClose size={18} />
              </button>
            ) : null}
          </div>

          {!expanded ? (
            <button
              type="button"
              onClick={toggleNavRail}
              className={navRailRowClassName()}
              aria-label={t('navigation:expandNavigation')}
            >
              <NavRailIconTrack>
                <PanelLeftOpen size={18} />
              </NavRailIconTrack>
            </button>
          ) : null}
        </div>
      </div>

      {/* Primary navigation */}
      <nav
        className={clsx(
          'flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto py-3',
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
        />
        <NotificationButton
          count={2}
          notifications={mockNotifications}
          expanded={expanded}
        />
        <NavRailLink
          to="/explore"
          label={t('navigation:explore')}
          icon={Compass}
          expanded={expanded}
          disabled
        />
        <NavRailChannels expanded={expanded} />
      </nav>

      {/* Bottom tray */}
      <div
        className={clsx(
          'flex shrink-0 flex-col gap-1 pb-2',
          navRailSectionClassName,
        )}
      >
        <Divider className="mt-0 mb-1" />
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
        <Divider className="my-1" />
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
    </aside>
  );
}

function NavRailChannels({ expanded }: { expanded: boolean }) {
  const { t } = useTranslation();
  const { data, isLoading } = useGraphQLQuery(ChannelsDocument);
  const channels = data?.channels ?? [];

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
      defaultOpen={channels.length > 0}
      className="flex flex-col gap-1"
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
          channels.map((channel) => (
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
              {channel.unreadCount != null && channel.unreadCount > 0 ? (
                <span className="bg-primary text-primary-foreground shrink-0 rounded-full px-1.5 py-0.5 text-xs font-medium">
                  {channel.unreadCount}
                </span>
              ) : null}
            </Link>
          ))
        )}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
