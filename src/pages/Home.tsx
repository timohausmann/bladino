import { PostDetailCard } from '../components/ui/PostDetailCard';

/**
 * Post type that matches PostDetailCardProps
 */
interface Post {
    avatar: string;
    name: string;
    handle: string;
    timestamp: string;
    content: string;
    reactions: { [emoji: string]: number; };
    comments: number;
}

/**
 * Home page component displaying sample posts with links
 */
export function Home() {
    // Sample posts with different types of content and links
    const posts: Post[] = [
        {
            avatar: 'https://i.pravatar.cc/150?img=2',
            name: 'Jane Smith',
            handle: 'janesmith',
            timestamp: 'May 25, 2023',
            content: 'Just launched my new website! It\'s amazing how much you can accomplish with the right tools and a clear vision. Check it out at https://example.com and let me know what you think. #webdev #launch #excited',
            reactions: {
                '👍': 72,
                '🎉': 48,
                '❤️': 22,
                '🚀': 8,
                '👏': 2
            },
            comments: 24
        },
        {
            avatar: 'https://i.pravatar.cc/150?img=3',
            name: 'Alex Johnson',
            handle: 'alexj',
            timestamp: 'May 24, 2023',
            content: 'The future of web development is here, and it\'s all about performance and user experience. I\'ve been exploring some cutting-edge techniques that have dramatically improved load times on my projects.',
            reactions: {
                '👍': 31,
                '💡': 28,
                '🔥': 15,
                '❤️': 10,
                '🤔': 3
            },
            comments: 12
        },
        {
            avatar: 'https://i.pravatar.cc/150?img=4',
            name: 'Sophia Chen',
            handle: 'sophiac',
            timestamp: 'May 23, 2023',
            content: 'I just published a new article about responsive design patterns: https://medium.com/someverylongpathname/article-about-responsive-design-that-would-normally-be-too-long-to-display-properly',
            reactions: {
                '👍': 87,
                '❤️': 56,
                '🔥': 31,
                '👀': 18,
                '💯': 11
            },
            comments: 31
        },
        {
            avatar: 'https://i.pravatar.cc/150?img=5',
            name: 'Marcus Williams',
            handle: 'marcusw',
            timestamp: 'May 22, 2023',
            content: 'Check out this amazing resource for free stock photos: https://unsplash.com - I use it all the time for my design projects!',
            reactions: {
                '👍': 52,
                '🙏': 27,
                '❤️': 21,
                '😍': 14,
                '🔥': 5
            },
            comments: 8
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