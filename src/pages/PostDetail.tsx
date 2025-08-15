import { useParams } from '@tanstack/react-router';
import { PostDetailCard } from '../components/ui/PostDetailCard';
import { samplePosts } from '../utils/samplePosts';

/**
 * PostDetail page - displays a single post by ID
 */
export function PostDetail() {
    const { id } = useParams({ from: '/post/$id' });

    // Find the post by ID (for now using array index, in real app would be actual ID)
    const postIndex = parseInt(id) - 1; // Convert 1-based ID to 0-based index
    const post = samplePosts[postIndex];

    if (!post) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Post Not Found</h1>
                    <p className="text-muted-foreground">The post you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <PostDetailCard
                    postId={parseInt(id)}
                    avatar={post.avatar}
                    name={post.name}
                    handle={post.handle}
                    timestamp={post.timestamp}
                    content={post.content}
                    reactions={post.reactions}
                    comments={post.comments}
                    currentUserAvatar="https://i.pravatar.cc/150?img=2"
                />
            </div>
        </div>
    );
}
