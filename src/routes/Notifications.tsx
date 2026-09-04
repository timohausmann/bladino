import { NotificationList } from '@/components/notifications/NotificationList';
import { type NotificationItem } from '@/components/notifications/notificationUtils';
import { useMarkAllNotificationsRead } from '@/components/notifications/useMarkAllNotificationsRead';
import { useMarkNotificationRead } from '@/components/notifications/useMarkNotificationRead';
import { useNotificationFeed } from '@/components/notifications/useNotificationFeed';
import { useNotificationUnreadCount } from '@/components/notifications/useNotificationUnreadCount';
import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Notifications page — cursor-paginated, user-scoped notification inbox.
 */
export function Notifications() {
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    isError,
    isFetchNextPageError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useNotificationFeed();
  const { data: unreadCountData } = useNotificationUnreadCount();
  const { mutate: markNotificationRead } = useMarkNotificationRead();
  const { mutate: markAllNotificationsRead, isPending: isMarkingAllRead } =
    useMarkAllNotificationsRead();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const notifications = useMemo(
    () =>
      (data?.pages ?? []).flatMap((page) => page.notifications.notifications),
    [data],
  );
  const unreadCount = unreadCountData?.unreadNotificationCount ?? 0;

  useEffect(() => {
    const element = loadMoreRef.current;
    if (
      !element ||
      !hasNextPage ||
      isFetchingNextPage ||
      isFetchNextPageError
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError]);

  const handleNotificationClick = (notification: NotificationItem) => {
    if (notification.dateRead) return;
    markNotificationRead({ id: notification.id });
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead({});
  };

  const handleLoadRetry = () => {
    if (isFetchNextPageError) {
      void fetchNextPage();
      return;
    }

    void refetch();
  };

  const loadError = (
    <div className="flex flex-col items-center gap-3">
      <Banner
        message={t('notifications:loadError')}
        variant="negative"
        className="w-full max-w-lg"
      />
      <Button
        variant="secondary"
        effect="none"
        size="sm"
        loading={isFetchNextPageError ? isFetchingNextPage : isRefetching}
        onClick={handleLoadRetry}
      >
        {t('notifications:retry')}
      </Button>
    </div>
  );

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col gap-4">
      <header className="shrink-0">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-foreground text-2xl font-bold">
            {t('notifications:title')}
          </h1>
          {unreadCount > 0 ? (
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm">
                {t('notifications:newCount', { count: unreadCount })}
              </span>
              <Button
                variant="secondary"
                effect="none"
                size="sm"
                loading={isMarkingAllRead}
                onClick={handleMarkAllRead}
              >
                {t('notifications:markAllRead')}
              </Button>
            </div>
          ) : null}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <p className="text-muted-foreground py-16 text-center text-sm">
            {t('notifications:loading')}
          </p>
        ) : isError && notifications.length === 0 ? (
          loadError
        ) : notifications.length > 0 ? (
          <>
            <NotificationList
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
            />

            {hasNextPage ? (
              <div ref={loadMoreRef} aria-hidden className="h-1" />
            ) : null}

            {isFetchingNextPage ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                {t('notifications:loadingMore')}
              </p>
            ) : null}

            {isError ? loadError : null}
          </>
        ) : (
          <div className="py-16 text-center text-neutral-500 dark:text-neutral-400">
            <Bell size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">{t('notifications:empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
