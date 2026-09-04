import { UnreadNotificationCountDocument, useGraphQLQuery } from '@/graphql';

const NOTIFICATION_POLL_INTERVAL_MS = 30_000;

/** Keeps the navigation badge fresh without introducing a realtime transport. */
export function useNotificationUnreadCount() {
  return useGraphQLQuery(UnreadNotificationCountDocument, undefined, {
    refetchInterval: NOTIFICATION_POLL_INTERVAL_MS,
  });
}
