import { PostCard } from '@/components/post/PostCard';
import { getCommentById } from '@/mocks';
import { useParams } from '@tanstack/react-router';

/**
 * PostDetail page - displays a single post by ID
 */
export function PostDetail() {
    const { id } = useParams({ from: '/_authenticated/post/$id' });
    const comment = getCommentById(id);

    if (!comment) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-foreground mb-2">Post Not Found</h1>
                <p className="text-muted-foreground">The post you're looking for doesn't exist.</p>
            </div>
        );
    }

    return <PostCard comment={comment} />;
}
