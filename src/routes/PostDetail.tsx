import { PostCard } from '@/components/post/PostCard';
import { CommentDocument, useGraphQLQuery, type Comment } from '@/graphql';
import { useParams } from '@tanstack/react-router';

/**
 * PostDetail page - displays a single post by ID
 */
export function PostDetail() {
    const { id } = useParams({ from: '/_authenticated/post/$id' });

    const { data, isLoading, isError } = useGraphQLQuery(CommentDocument, { id });

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Loading post…</p>
            </div>
        );
    }

    const comment = data?.comment;

    if (isError || !comment) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-foreground mb-2">Post Not Found</h1>
                <p className="text-muted-foreground">The post you're looking for doesn't exist.</p>
            </div>
        );
    }

    return <PostCard comment={comment as Comment} />;
}
