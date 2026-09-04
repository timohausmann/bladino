import type { NotificationsQuery } from '@/graphql';
import type { TFunction } from 'i18next';

export type NotificationItem =
  NotificationsQuery['notifications']['notifications'][number];

export function getNotificationLink(notification: NotificationItem):
  | {
      to: '/post/$id/comment/$commentId';
      params: { id: string; commentId: string };
    }
  | { to: '/post/$id'; params: { id: string } } {
  switch (notification.subjectType) {
    case 'COMMENT':
      if (notification.parentId) {
        return {
          to: '/post/$id/comment/$commentId',
          params: {
            id: notification.parentId,
            commentId: notification.subjectId,
          },
        };
      }

      return {
        to: '/post/$id',
        params: { id: notification.subjectId },
      };
  }
}

/** Messages stay client-localized; the API only supplies event data. */
export function getNotificationMessage(
  notification: NotificationItem,
  t: TFunction,
): string {
  const actor =
    notification.actor?.name ??
    notification.actorLabel ??
    t('notifications:unknownActor');

  switch (notification.type) {
    case 'COMMENT_LIKED':
      return t(
        notification.parentId
          ? 'notifications:types.commentLikedReply'
          : 'notifications:types.commentLiked',
        { actor },
      );
    case 'COMMENT_REPLIED_TO':
      return t('notifications:types.commentRepliedTo', { actor });
  }
}
