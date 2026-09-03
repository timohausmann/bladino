import { AppNavigation } from '@/components/layout/AppNavigation';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { Avatar } from '@/components/ui/Avatar';
import { IconButton, iconButtonVariants } from '@/components/ui/IconButton';
import { NotificationButton } from '@/components/ui/NotificationButton';
import {
  overlayBackdropEnterClassName,
  overlayContentVariants,
} from '@/components/ui/overlay/overlayVariants';
import {
  getMockNotifications,
  getUnreadNotificationCount,
} from '@/lib/mockNotifications';
import { useUserStore } from '@/stores/userStore';
import * as Dialog from '@radix-ui/react-dialog';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { type MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

/**
 * Compact app header for viewports below the desktop shell breakpoint.
 */
export function MobileHeader() {
  const { t } = useTranslation();
  const currentUser = useUserStore((store) => store.currentUser);
  const [isNavigationOpen, setNavigationOpen] = useState(false);
  const unreadNotificationCount = getUnreadNotificationCount(
    getMockNotifications(t),
  );

  // Close drawer upon navigation click
  const handleDrawerNavigation = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest('a')) {
      setNavigationOpen(false);
    }
  };

  return (
    <Dialog.Root open={isNavigationOpen} onOpenChange={setNavigationOpen}>
      <header
        className={clsx(
          'border-line bg-background/95 grid min-h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b px-3',
          'supports-backdrop-filter:bg-background/80 supports-backdrop-filter:backdrop-blur',
        )}
      >
        <div className="flex justify-start">
          {currentUser ? (
            <Dialog.Trigger asChild>
              <button
                type="button"
                className={iconButtonVariants()}
                aria-label={t('navigation:openNavigation')}
              >
                <Avatar
                  avatar={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-8 w-8"
                />
              </button>
            </Dialog.Trigger>
          ) : (
            <span className="h-10 w-10" aria-hidden />
          )}
        </div>

        <Link to="/" aria-label={t('navigation:dashboard')}>
          <AnimatedLogo animate={false} logoHeight="1.5rem" className="block" />
        </Link>

        <div className="ml-auto w-11">
          <NotificationButton count={unreadNotificationCount} />
        </div>
      </header>

      <Dialog.Portal>
        <Dialog.Overlay
          className={clsx(
            overlayBackdropEnterClassName,
            'fixed inset-0 z-50 bg-black/10 backdrop-blur-sm',
          )}
        />
        <Dialog.Content
          className={twMerge(
            overlayContentVariants({ tone: 'surface', motion: 'drawer' }),
            clsx(
              'fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(20rem,calc(100vw-1rem))] flex-col',
              'rounded-l-none rounded-r-2xl border-y-0 border-l-0 shadow-xl focus:outline-none',
            ),
          )}
        >
          <Dialog.Title className="sr-only">
            {t('navigation:drawerTitle')}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            {t('navigation:drawerDescription')}
          </Dialog.Description>

          <div className="border-line flex min-h-16 shrink-0 items-center justify-between border-b px-4">
            <AnimatedLogo
              animate={false}
              logoHeight="1.5rem"
              className="block"
            />
            <Dialog.Close asChild>
              <IconButton
                icon={<X size={20} aria-hidden />}
                label={t('navigation:closeNavigation')}
                disableTooltip
              />
            </Dialog.Close>
          </div>

          <div
            className="flex min-h-0 flex-1 flex-col"
            onClick={handleDrawerNavigation}
          >
            <AppNavigation expanded />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
