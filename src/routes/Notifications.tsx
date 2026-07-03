import {
  getMockNotifications,
  getUnreadNotificationCount,
} from '@/lib/mockNotifications';
import clsx from 'clsx';
import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Notifications page — full list of user notifications.
 */
export function Notifications() {
  const { t } = useTranslation();
  const notifications = getMockNotifications(t);
  const unreadCount = getUnreadNotificationCount(notifications);

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col gap-4">
      <header className="shrink-0">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-foreground text-2xl font-bold">
            {t('notifications:title')}
          </h1>
          {unreadCount > 0 ? (
            <span className="text-muted-foreground text-sm">
              {t('notifications:newCount', { count: unreadCount })}
            </span>
          ) : null}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {notifications.length > 0 ? (
          <ul className="space-y-1">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={clsx(
                  'flex items-center gap-3 rounded-lg p-3 transition-colors',
                  notification.isNew
                    ? 'bg-neutral-50 hover:bg-cyan-100 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700',
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {notification.timestamp}
                  </p>
                </div>
                {notification.isNew ? (
                  <div
                    className="h-2 w-2 shrink-0 rounded-full bg-cyan-500"
                    aria-hidden
                  />
                ) : null}
              </li>
            ))}
          </ul>
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
