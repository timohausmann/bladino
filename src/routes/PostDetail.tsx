import { PostCard } from '@/components/post/PostCard';
import { Back } from '@/components/ui/Back';
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
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Post Not Found</h1>
                    <p className="text-muted-foreground">The post you're looking for doesn't exist.</p>
                    <div className="mt-4">
                        <Back />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-3xl px-4 space-y-4">
                <Back />
                <PostCard comment={comment} />
            </div>
        </div>
    );
}
