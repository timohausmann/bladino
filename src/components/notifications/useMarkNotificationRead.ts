import { MarkNotificationReadDocument, useGraphQLMutation } from '@/graphql';
import { useQueryClient } from '@tanstack/react-query';

/** Marks the opened inbox row as read, then refreshes feed and badge. */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useGraphQLMutation(MarkNotificationReadDocument, {
    onSuccess: (data) => {
      if (!data.markNotificationRead) return;

      void queryClient.invalidateQueries({ queryKey: ['Notifications'] });
      void queryClient.invalidateQueries({
        queryKey: ['UnreadNotificationCount'],
      });
    },
  });
}
