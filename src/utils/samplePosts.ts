/**
 * Sample posts data for demonstration purposes
 */

/**
 * Post type that matches PostDetailCardProps
 */
export interface Post {
  avatar: string;
  name: string;
  handle: string;
  timestamp: string;
  content: string;
  reactions: { [emoji: string]: number };
  comments?: Post[]; // Optional comments array
  commentCount?: number; // Optional comment count for backward compatibility
}

/**
 * Sample posts with different types of content and links
 */
export const samplePosts: Post[] = [
  {
    avatar: "https://i.pravatar.cc/150?img=2",
    name: "Jane Smith",
    handle: "janesmith",
    timestamp: "May 25, 2023",
    content:
      "Just launched my new website! It's amazing how much you can accomplish with the right tools and a clear vision. Check it out at https://example.com and let me know what you think. #webdev #launch #excited",
    reactions: {
      "👍": 72,
      "🎉": 48,
      "❤️": 22,
      "🚀": 8,
      "👏": 2,
    },
    commentCount: 24,
    comments: [
      {
        avatar: "https://i.pravatar.cc/150?img=6",
        name: "Mike Chen",
        handle: "mikechen",
        timestamp: "May 25, 2023",
        content:
          "Congratulations! The website looks amazing. Love the clean design!",
        reactions: { "👍": 5, "❤️": 2 },
      },
      {
        avatar: "https://i.pravatar.cc/150?img=7",
        name: "Sarah Wilson",
        handle: "sarahw",
        timestamp: "May 25, 2023",
        content: "This is exactly what I needed for inspiration. Great work!",
        reactions: { "👍": 3, "🔥": 1 },
      },
    ],
  },
  {
    avatar: "https://i.pravatar.cc/150?img=3",
    name: "Alex Johnson",
    handle: "alexj",
    timestamp: "May 24, 2023",
    content:
      "The future of web development is here, and it's all about performance and user experience. I've been exploring some cutting-edge techniques that have dramatically improved load times on my projects.",
    reactions: {
      "👍": 31,
      "💡": 28,
      "🔥": 15,
      "❤️": 10,
      "🤔": 3,
    },
    commentCount: 12,
    comments: [
      {
        avatar: "https://i.pravatar.cc/150?img=8",
        name: "David Kim",
        handle: "davidk",
        timestamp: "May 24, 2023",
        content:
          "What specific techniques are you using? Would love to learn more!",
        reactions: { "👍": 8, "💡": 3 },
      },
    ],
  },
  {
    avatar: "https://i.pravatar.cc/150?img=4",
    name: "Sophia Chen",
    handle: "sophiac",
    timestamp: "May 23, 2023",
    content:
      "I just published a new article about responsive design patterns: https://medium.com/someverylongpathname/article-about-responsive-design-that-would-normally-be-too-long-to-display-properly",
    reactions: {
      "👍": 87,
      "❤️": 56,
      "🔥": 31,
      "👀": 18,
      "💯": 11,
    },
    commentCount: 31,
    comments: [
      {
        avatar: "https://i.pravatar.cc/150?img=9",
        name: "Emma Rodriguez",
        handle: "emmar",
        timestamp: "May 23, 2023",
        content:
          "Great article! The mobile-first approach you mentioned really helped me understand the concept better.",
        reactions: { "👍": 12, "❤️": 4 },
      },
      {
        avatar: "https://i.pravatar.cc/150?img=10",
        name: "Tom Anderson",
        handle: "tomand",
        timestamp: "May 23, 2023",
        content: "Bookmarked this for later. Thanks for sharing your insights!",
        reactions: { "👍": 7 },
      },
    ],
  },
  {
    avatar: "https://i.pravatar.cc/150?img=5",
    name: "Marcus Williams",
    handle: "marcusw",
    timestamp: "May 22, 2023",
    content:
      "Check out this amazing resource for free stock photos: https://unsplash.com - I use it all the time for my design projects!",
    reactions: {
      "👍": 52,
      "🙏": 27,
      "❤️": 21,
      "😍": 14,
      "🔥": 5,
    },
    commentCount: 8,
    comments: [
      {
        avatar: "https://i.pravatar.cc/150?img=11",
        name: "Lisa Park",
        handle: "lisap",
        timestamp: "May 22, 2023",
        content:
          "Unsplash is my go-to as well! The quality is incredible for free images.",
        reactions: { "👍": 9, "❤️": 3 },
      },
    ],
  },
];
