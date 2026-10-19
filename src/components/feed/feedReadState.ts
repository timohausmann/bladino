import type { UnreadOverviewQuery } from '@/graphql';

export type FeedReadScope =
  | { kind: 'home' }
  | { kind: 'channel'; channelId: string };

export interface FeedReadSnapshot {
  scopeKey: string;
  /** Feed-open timestamp sent to the mutation after the three-second delay. */
  snapshotAt: string;
  /**
   * Fallback time for a post that has no channel.
   * On the home feed this is the last feed visit. On a channel page it is
   * already that channel's effective last view.
   */
  lastViewedAt: string;
  /** Server count of unread top-level posts at feed-open time. */
  unreadPostCount: number;
  /**
   * Server cursors, keyed by channel id. Copied from
   * `effectiveLastViewedAt`; the client does not choose them.
   */
  channelEffectiveLastViewedAt: Readonly<Record<string, string>>;
}

export interface FeedSectionIndexes {
  newPostsIndex: number | null;
  earlierPostsIndex: number | null;
}

interface ReadableComment {
  dateCreated?: string | null;
  channel?: string | null;
  user: { id: string };
}

const getChannelReadBoundaries = (
  overview: UnreadOverviewQuery['unreadOverview'],
): Readonly<Record<string, string>> =>
  Object.fromEntries(
    overview.channels.map(({ channel, effectiveLastViewedAt }) => [
      channel.id,
      effectiveLastViewedAt,
    ]),
  );

/** Channel posts use that channel's time. Posts with no channel use `lastViewedAt`. */
const getCommentReadBoundary = (
  channelId: string | null | undefined,
  feedLastViewedAt: string,
  channelEffectiveLastViewedAt: Readonly<Record<string, string>> | undefined,
): string => {
  if (!channelId || !channelEffectiveLastViewedAt) {
    return feedLastViewedAt;
  }

  return channelEffectiveLastViewedAt[channelId] ?? feedLastViewedAt;
};

export const getFeedReadScopeKey = (scope: FeedReadScope): string =>
  scope.kind === 'home' ? 'home' : `channel:${scope.channelId}`;

/** Selects the boundary that the server used for the corresponding counter. */
export const createFeedReadSnapshot = (
  overview: UnreadOverviewQuery['unreadOverview'],
  scope: FeedReadScope,
): FeedReadSnapshot | null => {
  const scopeKey = getFeedReadScopeKey(scope);

  const channelEffectiveLastViewedAt = getChannelReadBoundaries(overview);

  if (scope.kind === 'home') {
    return {
      scopeKey,
      snapshotAt: overview.snapshotAt,
      lastViewedAt: overview.feed.lastViewedAt,
      unreadPostCount: overview.feed.unreadPostCount,
      channelEffectiveLastViewedAt,
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
    channelEffectiveLastViewedAt,
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
  channelEffectiveLastViewedAt?: Readonly<Record<string, string>>,
): boolean => {
  if (!currentUserId || comment.user.id === currentUserId) {
    return false;
  }

  const boundary = getCommentReadBoundary(
    comment.channel,
    lastViewedAt,
    channelEffectiveLastViewedAt,
  );
  return isCreatedAfter(comment.dateCreated, boundary);
};

/**
 * The new block is the leading run of top-level posts past the server cursor.
 * Replies on older posts stay below it; their own dot still uses that cursor.
 */
export const getFeedSectionIndexes = (
  comments: ReadonlyArray<{
    dateCreated?: string | null;
    channel?: string | null;
  }>,
  lastViewedAt: string | undefined,
  channelEffectiveLastViewedAt?: Readonly<Record<string, string>>,
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

    // `lastViewedAt` applies only when the post has no channel.
    const boundary = getCommentReadBoundary(
      comment.channel,
      lastViewedAt,
      channelEffectiveLastViewedAt,
    );
    // One new block at the top. Stop at the first already-seen post so a
    // channel visit cannot place the new divider below older posts.
    if (isCreatedAfter(comment.dateCreated, boundary)) {
      newPostsIndex ??= index;
      continue;
    }

    earlierPostsIndex = index;
    break;
  }

  return { newPostsIndex, earlierPostsIndex };
};
