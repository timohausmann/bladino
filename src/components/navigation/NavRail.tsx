import { AppNavigation } from '@/components/navigation/AppNavigation';
import { NavRailIconTrack } from '@/components/navigation/NavRailIconTrack';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { Tooltip } from '@/components/ui/Tooltip';
import {
  NAV_RAIL_COLLAPSED_WIDTH,
  NAV_RAIL_EXPANDED_WIDTH,
  navRailRowClassName,
  navRailSectionClassName,
} from '@/components/navigation/navRailLayout';
import { useUiStore } from '@/stores/uiStore';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Persistent left navigation rail for authenticated routes.
 */
export function NavRail() {
  const { t } = useTranslation();
  const expanded = useUiStore((store) => store.isNavRailExpanded);
  const toggleNavRail = useUiStore((store) => store.toggleNavRail);

  return (
    <aside
      className={clsx(
        'sticky top-0 flex h-dvh max-h-dvh min-h-0 shrink-0 flex-col overflow-hidden',
        'transition-[width] duration-300 ease-in-out',
        expanded ? NAV_RAIL_EXPANDED_WIDTH : NAV_RAIL_COLLAPSED_WIDTH,
      )}
    >
      {/* Header — 64px, matches Notes/Mails/Settings sidebar headers */}
      <div
        className={clsx(
          'flex min-h-16 shrink-0 items-center',
          navRailSectionClassName,
        )}
      >
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
                <Tooltip content={t('navigation:dashboard')}>
                  <Link to="/" aria-label={t('navigation:dashboard')}>
                    <img
                      src="/icon-trashnet-2026.svg"
                      alt="trashnet"
                      className="block h-8 w-8 shrink-0"
                    />
                  </Link>
                </Tooltip>
              </NavRailIconTrack>
            )}
            {expanded ? (
              <Tooltip content={t('navigation:collapseNavigation')}>
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
              </Tooltip>
            ) : null}
          </div>

          {!expanded ? (
            <Tooltip content={t('navigation:expandNavigation')}>
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
            </Tooltip>
          ) : null}
        </div>
      </div>

      <AppNavigation expanded={expanded} />
    </aside>
  );
}
