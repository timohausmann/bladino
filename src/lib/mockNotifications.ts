import type { TFunction } from 'i18next';

export interface Notification {
  id: string;
  message: string;
  isNew: boolean;
  timestamp: string;
}

/** Temporary mock data until notifications are backed by the API. */
export function getMockNotifications(t: TFunction): Notification[] {
  return [
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
}

export function getUnreadNotificationCount(
  notifications: Notification[],
): number {
  return notifications.filter((notification) => notification.isNew).length;
}
