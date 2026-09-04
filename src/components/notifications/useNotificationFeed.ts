import {
  NotificationsDocument,
  requestGraphQL,
  type NotificationsQuery,
} from '@/graphql';
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';

type NotificationPageParam = string | undefined;

/** Cursor-paginated notification inbox. */
export function useNotificationFeed() {
  return useInfiniteQuery<
    NotificationsQuery,
    Error,
    InfiniteData<NotificationsQuery>,
    ['Notifications'],
    NotificationPageParam
  >({
    queryKey: ['Notifications'],
    queryFn: ({ pageParam }) =>
      requestGraphQL(NotificationsDocument, {
        cursor: pageParam,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.notifications.cursor ?? undefined,
  });
}
