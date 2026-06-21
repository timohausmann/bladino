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
import { useUiStore } from '@/stores/uiStore';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import {
    ChevronDown,
    Compass,
    Hash,
    Home,
    Mail,
    PanelLeftOpen,
    PanelLeftClose,
    Settings,
    StickyNote,
} from 'lucide-react';

const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        message: 'Jane Smith liked your post',
        isNew: true,
        timestamp: '2 minutes ago',
    },
    {
        id: '2',
        message: 'New comment on your post',
        isNew: true,
        timestamp: '5 minutes ago',
    },
    {
        id: '3',
        message: 'You have a new follower',
        isNew: false,
        timestamp: '1 hour ago',
    },
];

const MOCK_CHANNELS = ['allgemein', 'projekte', 'memes'];

/**
 * Persistent left navigation rail for authenticated routes.
 */
export function NavRail() {
    const expanded = useUiStore(store => store.isNavRailExpanded);
    const toggleNavRail = useUiStore(store => store.toggleNavRail);

    return (
        <aside
            className={clsx(
                'sticky top-0 flex h-dvh min-h-dvh shrink-0 flex-col',
                'border-r border-neutral-200 dark:border-neutral-800',
                'bg-white/50 backdrop-blur-sm dark:bg-black/10',
                expanded ? NAV_RAIL_EXPANDED_WIDTH : NAV_RAIL_COLLAPSED_WIDTH,
            )}
        >
            {/* Header */}
            <div className={clsx('shrink-0 py-3', navRailSectionClassName)}>
                <div className="flex flex-col gap-1">
                    <div className={navRailRowClassName()}>
                        <NavRailIconTrack>
                            <Link to="/" aria-label="Home">
                                <img
                                    src="/logo-dashnet.svg"
                                    alt=""
                                    className="block h-8 w-8 shrink-0"
                                />
                            </Link>
                        </NavRailIconTrack>
                        {expanded ? (
                            <span
                                className={clsx(
                                    navRailLabelClassName,
                                    'font-bold font-monospace text-base tracking-tighter text-foreground',
                                )}
                            >
                                dashnet
                            </span>
                        ) : null}
                        {expanded ? (
                            <button
                                type="button"
                                onClick={toggleNavRail}
                                className={clsx(
                                    'ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                                    'text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800/80',
                                    'transition-colors duration-150',
                                )}
                                aria-label="Collapse navigation"
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
                            aria-label="Expand navigation"
                        >
                            <NavRailIconTrack>
                                <PanelLeftOpen size={18} />
                            </NavRailIconTrack>
                        </button>
                    ) : null}
                </div>
                <Divider className="mb-0 mt-2" />
            </div>

            {/* Primary navigation */}
            <nav
                className={clsx(
                    'flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto py-3',
                    navRailSectionClassName,
                )}
            >
                <NavRailLink to="/" label="Home" icon={Home} expanded={expanded} exact />
                <NotificationButton
                    count={2}
                    notifications={MOCK_NOTIFICATIONS}
                    expanded={expanded}
                />
                <NavRailLink to="/explore" label="Explore" icon={Compass} expanded={expanded} disabled />
                <NavRailChannels expanded={expanded} />
            </nav>

            {/* Bottom tray */}
            <div className={clsx('flex shrink-0 flex-col gap-1 pb-2', navRailSectionClassName)}>
                <Divider className="mb-1 mt-0" />
                <NavRailLink to="/notes" label="Notizen" icon={StickyNote} expanded={expanded} />
                <NavRailLink to="/email" label="E-Mail" icon={Mail} expanded={expanded} disabled />
                <Divider className="my-1" />
                {expanded ? (
                    <div className="flex w-full items-center gap-1">
                        <div className="min-w-0 flex-1">
                            <InteractiveAvatar showName />
                        </div>
                        <NavRailIconLink to="/settings" label="Settings" icon={Settings} />
                    </div>
                ) : (
                    <>
                        <NavRailLink to="/settings" label="Settings" icon={Settings} expanded={false} />
                        <InteractiveAvatar showName={false} />
                    </>
                )}
            </div>
        </aside>
    );
}

function NavRailChannels({ expanded }: { expanded: boolean }) {
    if (!expanded) {
        return (
            <NavRailLink to="/channels" label="Channels" icon={Hash} expanded={false} disabled />
        );
    }

    return (
        <Collapsible.Root defaultOpen={false} className="flex flex-col gap-1">
            <Collapsible.Trigger className={clsx(navRailRowClassName(), 'group')}>
                <NavRailIconTrack>
                    <Hash size={20} aria-hidden className="shrink-0" />
                </NavRailIconTrack>
                <span className={navRailLabelClassName}>Channels</span>
                <ChevronDown
                    size={16}
                    aria-hidden
                    className="mr-0.5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
            </Collapsible.Trigger>
            <Collapsible.Content className="flex flex-col gap-0.5 pb-1 pl-11 pr-0.5">
                {MOCK_CHANNELS.map(channel => (
                    <div
                        key={channel}
                        className="cursor-not-allowed rounded-lg px-2 py-2 text-sm text-neutral-400 dark:text-neutral-600"
                    >
                        <span className="truncate">#{channel}</span>
                    </div>
                ))}
            </Collapsible.Content>
        </Collapsible.Root>
    );
}
