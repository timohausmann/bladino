import { PostCard } from '@/components/post';
import type { Comment, CommentFeedQuery, CommentFilter } from '@/graphql';
import { useEffect, useMemo, useRef } from 'react';
import { useCommentFeed } from './useCommentFeed';

export type FeedComment = NonNullable<
    NonNullable<CommentFeedQuery['commentFeed']>['comments'][number]
>;

export interface CommentFeedProps {
    filter: CommentFilter;
    emptyMessage?: string;
    title?: string;
    className?: string;
}

/**
 * Infinite-scrolling comment feed. Loads the next page when the sentinel
 * near the bottom enters the viewport.
 */
export function CommentFeed({
    filter,
    emptyMessage = 'No posts yet.',
    title,
    className,
}: CommentFeedProps) {
    const {
        data,
        isLoading,
        isError,
        error,
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
                <h2 className="text-xl font-bold text-foreground mb-6">{title}</h2>
            )}

            <div className="flex flex-col gap-6">
                {isLoading && (
                    <p className="text-muted-foreground text-center py-8">Loading feed…</p>
                )}

                {isError && (
                    <p className="text-destructive text-center py-8">
                        Failed to load feed{error instanceof Error ? `: ${error.message}` : '.'}
                    </p>
                )}

                {!isLoading && !isError && comments.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">{emptyMessage}</p>
                )}

                {comments.map((comment) => (
                    <PostCard
                        key={comment.id}
                        comment={comment as Comment}
                    />
                ))}

                {hasNextPage && <div ref={loadMoreRef} aria-hidden className="h-1" />}

                {isFetchingNextPage && (
                    <p className="text-muted-foreground text-center py-4">Loading more…</p>
                )}
            </div>
        </div>
    );
}
