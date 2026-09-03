import type { UnreadOverviewQuery } from '@/graphql';

export type FeedReadScope =
  | { kind: 'home' }
  | { kind: 'channel'; channelId: string };

export interface FeedReadSnapshot {
  scopeKey: string;
  /** Feed-open timestamp sent to the mutation after the three-second delay. */
  snapshotAt: string;
  /** Previous read boundary used for stable dividers and unread indicators. */
  lastViewedAt: string;
  /** Server count of unread top-level posts at feed-open time. */
  unreadPostCount: number;
}

export interface FeedSectionIndexes {
  newPostsIndex: number | null;
  earlierPostsIndex: number | null;
}

interface ReadableComment {
  dateCreated?: string | null;
  user: { id: string };
}

export const getFeedReadScopeKey = (scope: FeedReadScope): string =>
  scope.kind === 'home' ? 'home' : `channel:${scope.channelId}`;

/** Selects the boundary that the server used for the corresponding counter. */
export const createFeedReadSnapshot = (
  overview: UnreadOverviewQuery['unreadOverview'],
  scope: FeedReadScope,
): FeedReadSnapshot | null => {
  const scopeKey = getFeedReadScopeKey(scope);

  if (scope.kind === 'home') {
    return {
      scopeKey,
      snapshotAt: overview.snapshotAt,
      lastViewedAt: overview.feed.lastViewedAt,
      unreadPostCount: overview.feed.unreadPostCount,
    };
  }

  const channelState = overview.channels.find(
    ({ channel }) => channel.id === scope.channelId,
  );
  if (!channelState) {
    return null;
  }

  return {
    scopeKey,
    snapshotAt: overview.snapshotAt,
    lastViewedAt: channelState.effectiveLastViewedAt,
    unreadPostCount: channelState.unreadPostCount,
  };
};

export const isCreatedAfter = (
  dateCreated: string | null | undefined,
  lastViewedAt: string,
): boolean => {
  if (!dateCreated) return false;

  const createdTimestamp = new Date(dateCreated).getTime();
  const viewedTimestamp = new Date(lastViewedAt).getTime();
  if (Number.isNaN(createdTimestamp) || Number.isNaN(viewedTimestamp)) {
    return false;
  }

  return createdTimestamp > viewedTimestamp;
};

export const isCommentUnread = (
  comment: ReadableComment,
  lastViewedAt: string,
  currentUserId: string | undefined,
): boolean => {
  if (!currentUserId || comment.user.id === currentUserId) {
    return false;
  }

  return isCreatedAfter(comment.dateCreated, lastViewedAt);
};

/**
 * Sections follow top-level post time only. This keeps new replies on old
 * posts in the earlier section while their own unread dot remains visible.
 */
export const getFeedSectionIndexes = (
  comments: ReadonlyArray<{ dateCreated?: string | null }>,
  lastViewedAt: string | undefined,
): FeedSectionIndexes => {
  if (!lastViewedAt) {
    return {
      newPostsIndex: null,
      earlierPostsIndex: null,
    };
  }

  let newPostsIndex: number | null = null;
  let earlierPostsIndex: number | null = null;

  for (let index = 0; index < comments.length; index += 1) {
    const comment = comments[index];
    if (!comment) continue;

    if (isCreatedAfter(comment.dateCreated, lastViewedAt)) {
      newPostsIndex ??= index;
    } else {
      earlierPostsIndex ??= index;
    }

    if (newPostsIndex !== null && earlierPostsIndex !== null) {
      break;
    }
  }

  return { newPostsIndex, earlierPostsIndex };
};
