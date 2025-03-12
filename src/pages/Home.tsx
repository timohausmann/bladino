import { PostDetailCard } from '../components/ui/PostDetailCard';

/**
 * Home page component displaying sample posts with links
 */
export function Home() {
    // Sample posts with different types of content and links
    const posts = [
        {
            avatar: 'https://i.pravatar.cc/150?img=2',
            name: 'Jane Smith',
            handle: 'janesmith',
            timestamp: 'May 25, 2023',
            content: 'Just launched my new website! It\'s amazing how much you can accomplish with the right tools and a clear vision. Check it out at https://example.com and let me know what you think. #webdev #launch #excited',
            likes: 152,
            comments: 24,
            shares: 8
        },
        {
            avatar: 'https://i.pravatar.cc/150?img=3',
            name: 'Alex Johnson',
            handle: 'alexj',
            timestamp: 'May 24, 2023',
            content: 'The future of web development is here, and it\'s all about performance and user experience. I\'ve been exploring some cutting-edge techniques that have dramatically improved load times on my projects.',
            likes: 87,
            comments: 12,
            shares: 3
        },
        {
            avatar: 'https://i.pravatar.cc/150?img=4',
            name: 'Sophia Chen',
            handle: 'sophiac',
            timestamp: 'May 23, 2023',
            content: 'I just published a new article about responsive design patterns: https://medium.com/someverylongpathname/article-about-responsive-design-that-would-normally-be-too-long-to-display-properly',
            likes: 203,
            comments: 31,
            shares: 17
        },
        {
            avatar: 'https://i.pravatar.cc/150?img=5',
            name: 'Marcus Williams',
            handle: 'marcusw',
            timestamp: 'May 22, 2023',
            content: 'Check out this amazing resource for free stock photos: https://unsplash.com - I use it all the time for my design projects!',
            likes: 119,
            comments: 8,
            shares: 42
        }
    ];

    return (
        <div>
            <h1 className="mb-6 text-2xl">Home</h1>

            {/* Display all posts */}
            {posts.map((post, index) => (
                <PostDetailCard key={`post-${index}`} {...post} />
            ))}
        </div>
    );
} 