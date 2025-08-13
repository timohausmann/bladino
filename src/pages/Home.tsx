import { PostDetailCard } from '../components/ui/PostDetailCard';
import { samplePosts } from '../utils/samplePosts';

/**
 * Home page component displaying sample posts with links
 */
export function Home() {
    return (
        <div className="flex-1 py-8">
            <div className="container max-w-3xl mx-auto px-4">
                {/* Display all posts */}
                <div className="flex flex-col gap-6">
                    {samplePosts.map((post, index) => (
                        <div key={`post-${index}`}>
                            <PostDetailCard
                                postId={index + 1}
                                {...post}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 