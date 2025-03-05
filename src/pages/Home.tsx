import { PostDetailCard } from '../components/ui/PostDetailCard';

/**
 * Home page component displaying a sample post
 */
export function Home() {
    // Sample post data
    const samplePost = {
        avatar: 'https://i.pravatar.cc/150?img=2',
        name: 'Jane Smith',
        handle: 'janesmith',
        timestamp: 'May 25, 2023',
        content: 'Just launched my new website! It\'s amazing how much you can accomplish with the right tools and a clear vision. Check it out and let me know what you think. #webdev #launch #excited',
        likes: 152,
        comments: 24,
        shares: 8
    };

    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Home</h1>

            {/* Featured Post */}
            <PostDetailCard {...samplePost} />

            {/* Another sample post */}
            <PostDetailCard
                avatar="https://i.pravatar.cc/150?img=3"
                name="Alex Johnson"
                handle="alexj"
                timestamp="May 24, 2023"
                content="The future of web development is here, and it's all about performance and user experience. I've been exploring some cutting-edge techniques that have dramatically improved load times on my projects."
                likes={87}
                comments={12}
                shares={3}
            />
        </div>
    );
} 