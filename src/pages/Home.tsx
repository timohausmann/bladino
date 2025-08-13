import { PostDetailCard } from '../components/ui/PostDetailCard';
import { samplePosts } from '../utils/samplePosts';

/**
 * Home page component displaying sample posts with links
 */
export function Home() {
    return (
        <div>
            {/* Display all posts */}
            <div className="flex flex-col gap-6">
                {samplePosts.map((post, index) => (
                    <PostDetailCard key={`post-${index}`} {...post} />
                ))}
            </div>
        </div>
    );
} 