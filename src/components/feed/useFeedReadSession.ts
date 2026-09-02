import {
  isRetryableGraphQLError,
  UnreadOverviewDocument,
  UpdateChannelViewDocument,
  UpdateHomeFeedViewDocument,
  useGraphQLMutation,
  useGraphQLQuery,
} from '@/graphql';
import { useUserStore } from '@/stores/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  createFeedReadSnapshot,
  getFeedReadScopeKey,
  type FeedReadScope,
  type FeedReadSnapshot,
} from './feedReadState';

const MARK_AS_READ_DELAY_MS = 3_000;
const UNREAD_OVERVIEW_QUERY_KEY = ['UnreadOverview'] as const;

interface FeedReadSession {
  snapshot: FeedReadSnapshot | null;
  currentUserId: string | undefined;
}

const shouldRetryMutation = (failureCount: number, error: Error): boolean =>
  failureCount < 1 && isRetryableGraphQLError(error);

/**
 * Freezes one fresh server overview per route scope, then acknowledges exactly
 * that snapshot after the dwell delay. Later cache updates cannot move it.
 */
export function useFeedReadSession(
  scope: FeedReadScope | undefined,
): FeedReadSession {
  const currentUser = useUserStore((store) => store.currentUser);
  const queryClient = useQueryClient();
  const [snapshot, setSnapshot] = useState<FeedReadSnapshot | null>(null);
  const scopeKind = scope?.kind;
  const channelId = scope?.kind === 'channel' ? scope.channelId : undefined;
  const scopeKey = scope ? getFeedReadScopeKey(scope) : null;

  const { refetch } = useGraphQLQuery(UnreadOverviewDocument, undefined, {
    enabled: scope != null,
  });
  const { mutateAsync: updateHomeFeedView } = useGraphQLMutation(
    UpdateHomeFeedViewDocument,
    { retry: shouldRetryMutation },
  );
  const { mutateAsync: updateChannelView } = useGraphQLMutation(
    UpdateChannelViewDocument,
    { retry: shouldRetryMutation },
  );

  useEffect(() => {
    if (!scopeKey || !scopeKind) {
      return;
    }
    if (scopeKind === 'channel' && !channelId) {
      return;
    }

    const activeScope: FeedReadScope =
      scopeKind === 'home'
        ? { kind: 'home' }
        : { kind: 'channel', channelId: channelId! };
    const enteredAt = Date.now();
    let disposed = false;
    let timeoutId: number | undefined;

    const markSnapshotAsRead = async (
      nextSnapshot: FeedReadSnapshot,
    ): Promise<void> => {
      if (activeScope.kind === 'home') {
        await updateHomeFeedView({ viewedAt: nextSnapshot.snapshotAt });
      } else {
        await updateChannelView({
          id: activeScope.channelId,
          viewedAt: nextSnapshot.snapshotAt,
        });
      }

      await queryClient.invalidateQueries({
        queryKey: UNREAD_OVERVIEW_QUERY_KEY,
      });
    };

    const startReadSession = async (): Promise<void> => {
      const result = await refetch();
      if (disposed || !result.isSuccess || !result.data) {
        return;
      }

      const nextSnapshot = createFeedReadSnapshot(
        result.data.unreadOverview,
        activeScope,
      );
      if (!nextSnapshot) {
        return;
      }

      setSnapshot(nextSnapshot);

      const elapsed = Date.now() - enteredAt;
      const remainingDelay = Math.max(0, MARK_AS_READ_DELAY_MS - elapsed);
      timeoutId = window.setTimeout(() => {
        if (disposed) return;
        void markSnapshotAsRead(nextSnapshot).catch(() => undefined);
      }, remainingDelay);
    };

    void startReadSession();

    return () => {
      disposed = true;
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [
    channelId,
    queryClient,
    refetch,
    scopeKey,
    scopeKind,
    updateChannelView,
    updateHomeFeedView,
  ]);

  return {
    snapshot: snapshot?.scopeKey === scopeKey ? snapshot : null,
    currentUserId: currentUser?.id,
  };
}
