import { CreatePost } from '@/components/create/CreatePost';
import { PostCard } from '@/components/post';
import { PresenceRail } from '@/components/presence';
import { CommentFeedDocument, useGraphQLQuery, type CommentFeedQuery } from '@/graphql';
import { mockPresenceEntries } from '@/mocks';
import { useMemo } from 'react';

type FeedComment = NonNullable<
    NonNullable<CommentFeedQuery['commentFeed']>['comments'][number]
>;

/**
 * Home page component displaying create post form and live feed posts
 */
export function Home() {
    const { data, isLoading, isError, error } = useGraphQLQuery(CommentFeedDocument, {
        filter: {},
    });

    const comments = useMemo(() => {
        return (data?.commentFeed?.comments ?? []).filter(
            (comment): comment is FeedComment => comment != null,
        );
    }, [data]);

    return (
        <div className="flex-1 py-8">
            <div className="container max-w-3xl mx-auto px-4 flex flex-col gap-8">
                <CreatePost />

                <PresenceRail entries={mockPresenceEntries} />

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
                        <p className="text-muted-foreground text-center py-8">No posts yet.</p>
                    )}

                    {comments.map((comment) => (
                        <PostCard
                            key={comment.id}
                            comment={comment}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
