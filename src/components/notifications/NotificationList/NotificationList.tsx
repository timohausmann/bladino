import {
  getNotificationLink,
  getNotificationMessage,
  type NotificationItem,
} from '@/components/notifications/notificationUtils';
import { formatRelativeCommentDate } from '@/utils/formatDate';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { Heart, MessageCircle, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NotificationListProps {
  notifications: NotificationItem[];
  onNotificationClick?: (notification: NotificationItem) => void;
  className?: string;
}

interface NotificationListItemProps {
  notification: NotificationItem;
  onClick?: (notification: NotificationItem) => void;
}

const notificationIcons: Record<NotificationItem['type'], LucideIcon> = {
  COMMENT_LIKED: Heart,
  COMMENT_REPLIED_TO: MessageCircle,
};

const NotificationListItem = ({
  notification,
  onClick,
}: NotificationListItemProps) => {
  const { t } = useTranslation();
  const isUnread = notification.dateRead === null;
  const link = getNotificationLink(notification);
  const Icon = notificationIcons[notification.type];
  const message = getNotificationMessage(notification, t);

  const handleClick = () => {
    onClick?.(notification);
  };

  return (
    <li>
      <Link
        to={link.to}
        params={link.params}
        onClick={handleClick}
        aria-label={message}
        className={clsx([
          'flex w-full items-center gap-4 rounded-lg px-3 py-2.5 text-left',
          'text-surface-foreground transition-colors duration-150',
          isUnread
            ? 'border-elevated-border bg-elevated hover:bg-elevated-hover border'
            : 'border-surface-border bg-surface hover:bg-surface-hover border',
        ])}
      >
        <Icon
          size={16}
          className="shrink-0 text-neutral-400 dark:text-neutral-500"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{message}</p>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            {formatRelativeCommentDate(notification.dateCreated)}
          </p>
        </div>
        {isUnread ? (
          <div
            className="h-2 w-2 shrink-0 rounded-full bg-cyan-500"
            aria-hidden
          />
        ) : null}
      </Link>
    </li>
  );
};

/**
 * Inbox rows for likes and replies, with unread elevation and type icons.
 */
export function NotificationList({
  notifications,
  onNotificationClick,
  className,
}: NotificationListProps) {
  const { t } = useTranslation();

  return (
    <ul
      aria-label={t('notifications:title')}
      className={clsx('flex flex-col gap-2', className)}
    >
      {notifications.map((notification) => (
        <NotificationListItem
          key={notification.id}
          notification={notification}
          onClick={onNotificationClick}
        />
      ))}
    </ul>
  );
}
