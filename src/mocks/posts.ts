import { Post } from "@/types";

/**
 * Sample posts with different types of content and links
 * Now references users by ID instead of embedding user data
 */
export const mockPosts: Post[] = [
  {
    id: "post-1",
    userId: "user-1", // Jane Smith
    content:
      "Just launched my new website! It's amazing how much you can accomplish with the right tools and a clear vision. Check it out at https://example.com and let me know what you think. #webdev #launch #excited",
    timestamp: "May 25, 2023",
    reactions: {
      "👍": 72,
      "🎉": 48,
      "❤️": 22,
      "🚀": 8,
      "👏": 2,
    },
    files: [
      {
        id: "file-1-1",
        url: "/mockfiles/image-landscape.jpeg",
        filename: "website-screenshot.jpeg",
        type: "image/jpeg",
        size: 71000,
      },
      {
        id: "file-1-2",
        url: "/mockfiles/dummy.pdf",
        filename: "project-specs.pdf",
        type: "application/pdf",
        size: 13000,
      },
    ],
    comments: [
      {
        id: "comment-1-1",
        parentPostId: "post-1",
        userId: "user-5", // Mike Chen
        content:
          "Congratulations! The website looks amazing. Love the clean design!",
        timestamp: "May 25, 2023",
        reactions: { "👍": 5, "❤️": 2 },
      },
      {
        id: "comment-1-2",
        parentPostId: "post-1",
        userId: "user-6", // Sarah Wilson
        content: "This is exactly what I needed for inspiration. Great work!",
        timestamp: "May 25, 2023",
        reactions: { "👍": 3, "🔥": 1 },
      },
    ],
  },
  {
    id: "post-2",
    userId: "user-2", // Alex Johnson
    content:
      "The future of web development is here, and it's all about performance and user experience. I've been exploring some cutting-edge techniques that have dramatically improved load times on my projects.",
    timestamp: "May 24, 2023",
    reactions: {
      "👍": 31,
      "💡": 28,
      "🔥": 15,
      "❤️": 10,
      "🤔": 3,
    },
    files: [
      {
        id: "file-2-1",
        url: "/mockfiles/image-portrait.jpeg",
        filename: "performance-chart.jpeg",
        type: "image/jpeg",
        size: 50000,
      },
      {
        id: "file-2-2",
        url: "/mockfiles/audio.mp3",
        filename: "demo-audio.mp3",
        type: "audio/mpeg",
        size: 181000,
      },
    ],
    comments: [
      {
        id: "comment-2-1",
        parentPostId: "post-2",
        userId: "user-7", // David Kim
        content:
          "What specific techniques are you using? Would love to learn more!",
        timestamp: "May 24, 2023",
        reactions: { "👍": 8, "💡": 3 },
      },
    ],
  },
  {
    id: "post-3",
    userId: "user-3", // Sophia Chen
    content:
      "I just published a new article about responsive design patterns: https://medium.com/someverylongpathname/article-about-responsive-design-that-would-normally-be-too-long-to-display-properly",
    timestamp: "May 23, 2023",
    reactions: {
      "👍": 87,
      "❤️": 56,
      "🔥": 31,
      "👀": 18,
      "💯": 11,
    },
    files: [
      {
        id: "file-3-1",
        url: "/mockfiles/MP4_640_3MG.mp4",
        filename: "responsive-demo.mp4",
        type: "video/mp4",
        size: 3000000,
      },
    ],
    comments: [
      {
        id: "comment-3-1",
        parentPostId: "post-3",
        userId: "user-8", // Emma Rodriguez
        content:
          "Great article! The mobile-first approach you mentioned really helped me understand the concept better.",
        timestamp: "May 23, 2023",
        reactions: { "👍": 12, "❤️": 4 },
      },
      {
        id: "comment-3-2",
        parentPostId: "post-3",
        userId: "user-9", // Tom Anderson
        content: "Bookmarked this for later. Thanks for sharing your insights!",
        timestamp: "May 23, 2023",
        reactions: { "👍": 7 },
      },
    ],
  },
  {
    id: "post-4",
    userId: "user-4", // Marcus Williams
    content:
      "Check out this amazing resource for free stock photos: https://unsplash.com - I use it all the time for my design projects!",
    timestamp: "May 22, 2023",
    reactions: {
      "👍": 52,
      "🙏": 27,
      "❤️": 21,
      "😍": 14,
      "🔥": 5,
    },
    comments: [
      {
        id: "comment-4-1",
        parentPostId: "post-4",
        userId: "user-10", // Lisa Park
        content:
          "Unsplash is my go-to as well! The quality is incredible for free images.",
        timestamp: "May 22, 2023",
        reactions: { "👍": 9, "❤️": 3 },
      },
    ],
  },
];

/**
 * Helper function to get posts by user ID
 */
export function getPostsByUserId(userId: string): Post[] {
  return mockPosts.filter((post) => post.userId === userId);
}
