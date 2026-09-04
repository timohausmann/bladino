import {
  MarkAllNotificationsReadDocument,
  useGraphQLMutation,
} from '@/graphql';
import { useQueryClient } from '@tanstack/react-query';

/** Marks every unread inbox row for the signed-in user. */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useGraphQLMutation(MarkAllNotificationsReadDocument, {
    onSuccess: (data) => {
      if (!data.markAllNotificationsRead) return;

      void queryClient.invalidateQueries({ queryKey: ['Notifications'] });
      void queryClient.invalidateQueries({
        queryKey: ['UnreadNotificationCount'],
      });
    },
  });
}
