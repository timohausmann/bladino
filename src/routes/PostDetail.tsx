import { PostCard } from '@/components/post/PostCard';
import { Back } from '@/components/ui/Back';
import { mockPosts } from '@/mocks';
import { useParams } from '@tanstack/react-router';

/**
 * PostDetail page - displays a single post by ID
 */
export function PostDetail() {
    const { id } = useParams({ from: '/post/$id' });

    // Find the post by ID
    const post = mockPosts.find(p => p.id === id);

    if (!post) {
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
                <PostCard
                    post={post}
                />
            </div>
        </div>
    );
}
