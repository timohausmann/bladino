import { CreatePostToggle } from '../components/create';
import { PostDetailCard } from '../components/ui/PostDetailCard';
import { samplePosts } from '../utils/samplePosts';

/**
 * Home page component displaying create post form and sample posts
 */
export function Home() {
    return (
        <div className="flex-1 py-8">
            <div className="container max-w-3xl mx-auto px-4 flex flex-col gap-8">
                {/* Create Post Toggle */}
                <CreatePostToggle />

                {/* Display all posts */}
                <div className="flex flex-col gap-6">
                    {samplePosts.map((post, index) => (
                        <div key={`post-${index}`}>
                            <PostDetailCard
                                postId={index + 1}
                                {...post}
                                currentUserAvatar="https://i.pravatar.cc/150?img=2"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 