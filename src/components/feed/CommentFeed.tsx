import { PostCard } from '@/components/post';
import { Banner } from '@/components/ui/Banner';
import { TimelineDivider } from '@/components/ui/TimelineDivider';
import type { Comment, CommentFeedQuery, CommentFilter } from '@/graphql';
import { useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getFeedSectionIndexes,
  isCommentUnread,
  type FeedReadScope,
} from './feedReadState';
import { useCommentFeed } from './useCommentFeed';
import { useFeedReadSession } from './useFeedReadSession';

export type FeedComment = NonNullable<
  NonNullable<CommentFeedQuery['commentFeed']>['comments'][number]
>;

export interface CommentFeedProps {
  filter: CommentFilter;
  emptyMessage?: string;
  title?: string;
  className?: string;
  readScope?: FeedReadScope;
}

/**
 * Infinite-scrolling comment feed. Loads the next page when the sentinel
 * near the bottom enters the viewport.
 */
export function CommentFeed({
  filter,
  emptyMessage,
  title,
  className,
  readScope,
}: CommentFeedProps) {
  const { t } = useTranslation();
  const resolvedEmptyMessage = emptyMessage ?? t('posts:emptyFeed');
  const { snapshot, currentUserId } = useFeedReadSession(readScope);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommentFeed(filter);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const comments = useMemo(
    () =>
      (data?.pages ?? []).flatMap((page) =>
        (page.commentFeed?.comments ?? []).filter(
          (comment): comment is FeedComment => comment != null,
        ),
      ),
    [data],
  );
  const sectionIndexes = useMemo(
    () => getFeedSectionIndexes(comments, snapshot?.lastViewedAt),
    [comments, snapshot?.lastViewedAt],
  );
  const unreadPostCount = snapshot?.unreadPostCount ?? 0;
  const hasNewPostSection =
    sectionIndexes.newPostsIndex !== null && unreadPostCount > 0;
  const getIsUnread = useCallback(
    (comment: Comment) =>
      snapshot
        ? isCommentUnread(comment, snapshot.lastViewedAt, currentUserId)
        : false,
    [currentUserId, snapshot],
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className={className}>
      {title && (
        <h2 className="text-foreground pt-2 pb-1 text-lg font-bold">{title}</h2>
      )}

      <div className="flex flex-col gap-8 py-6">
        {isLoading && (
          <p className="text-muted-foreground py-8 text-center">
            {t('posts:loadingFeed')}
          </p>
        )}

        {isError && (
          <Banner
            message={t('errors:feedLoadFailed')}
            variant="negative"
            className="mx-auto max-w-lg"
          />
        )}

        {!isLoading && !isError && comments.length === 0 && (
          <p className="text-muted-foreground py-8 text-center">
            {resolvedEmptyMessage}
          </p>
        )}

        {comments.map((comment, index) => (
          <Fragment key={comment.id}>
            {hasNewPostSection && index === sectionIndexes.newPostsIndex && (
              <TimelineDivider
                label={t('posts:timelineNew', {
                  count: unreadPostCount,
                })}
                showNewIndicator
              />
            )}
            {hasNewPostSection &&
              index === sectionIndexes.earlierPostsIndex && (
                <TimelineDivider label={t('posts:timelineEarlier')} />
              )}
            <PostCard
              comment={comment as Comment}
              isUnread={getIsUnread(comment as Comment)}
              getIsUnread={getIsUnread}
            />
          </Fragment>
        ))}

        {hasNextPage && <div ref={loadMoreRef} aria-hidden className="h-1" />}

        {isFetchingNextPage && (
          <p className="text-muted-foreground py-4 text-center">
            {t('posts:loadingMore')}
          </p>
        )}
      </div>
    </div>
  );
}
