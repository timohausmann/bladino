import type { Comment, File } from '@/graphql';
import { getUserById } from './users';

function user(userId: string) {
  const found = getUserById(userId);
  if (!found) {
    throw new Error(`Mock user not found: ${userId}`);
  }
  return found;
}

function mockFile(
  id: string,
  userId: string,
  file: Pick<File, 'filename'> & Partial<Omit<File, 'filename'>>,
): File {
  return {
    id,
    user: user(userId),
    ...file,
  };
}

function mockComment(
  comment: Pick<Comment, 'id' | 'body' | 'dateCreated'> &
    Partial<
      Pick<Comment, 'dateEdited' | 'parent' | 'children' | 'files' | 'voteNum'>
    > & {
      userId: string;
    },
): Comment {
  const { userId, ...rest } = comment;
  return {
    user: user(userId),
    ...rest,
  };
}

/** Sample feed comments shaped like GraphQL Comment objects. */
export const mockComments: Comment[] = [
  mockComment({
    id: 'post-1',
    userId: 'user-1',
    body: "Just launched my new website! It's amazing how much you can accomplish with the right tools and a clear vision. Check it out at https://example.com and let me know what you think. #webdev #launch #excited",
    dateCreated: '2023-05-25',
    voteNum: 150,
    files: [
      mockFile('file-1-1', 'user-1', {
        filename: '/mockfiles/image-landscape.jpeg',
        name: 'website-screenshot.jpeg',
        type: 'image/jpeg',
        size: 71000,
      }),
      mockFile('file-1-2', 'user-1', {
        filename: '/mockfiles/dummy.pdf',
        name: 'project-specs.pdf',
        type: 'application/pdf',
        size: 13000,
      }),
    ],
    children: [
      mockComment({
        id: 'comment-1-1',
        userId: 'user-5',
        parent: 'post-1',
        body: 'Congratulations! The website looks amazing. Love the clean design!',
        dateCreated: '2023-05-25',
      }),
      mockComment({
        id: 'comment-1-2',
        userId: 'user-6',
        parent: 'post-1',
        body: 'This is exactly what I needed for inspiration. Great work!',
        dateCreated: '2023-05-25',
      }),
    ],
  }),
  mockComment({
    id: 'post-2',
    userId: 'user-2',
    body: "The future of web development is here, and it's all about performance and user experience. I've been exploring some cutting-edge techniques that have dramatically improved load times on my projects.",
    dateCreated: '2023-05-24',
    voteNum: 87,
    files: [
      mockFile('file-2-1', 'user-2', {
        filename: '/mockfiles/image-portrait.jpeg',
        name: 'performance-chart.jpeg',
        type: 'image/jpeg',
        size: 50000,
      }),
      mockFile('file-2-2', 'user-2', {
        filename: '/mockfiles/audio.mp3',
        name: 'demo-audio.mp3',
        type: 'audio/mpeg',
        size: 181000,
      }),
    ],
    children: [
      mockComment({
        id: 'comment-2-1',
        userId: 'user-7',
        parent: 'post-2',
        body: 'What specific techniques are you using? Would love to learn more!',
        dateCreated: '2023-05-24',
      }),
    ],
  }),
  mockComment({
    id: 'post-3',
    userId: 'user-3',
    body: 'I just published a new article about responsive design patterns: https://medium.com/someverylongpathname/article-about-responsive-design-that-would-normally-be-too-long-to-display-properly',
    dateCreated: '2023-05-23',
    voteNum: 203,
    files: [
      mockFile('file-3-1', 'user-3', {
        filename: '/mockfiles/MP4_640_3MG.mp4',
        name: 'responsive-demo.mp4',
        type: 'video/mp4',
        size: 3000000,
      }),
    ],
    children: [
      mockComment({
        id: 'comment-3-1',
        userId: 'user-8',
        parent: 'post-3',
        body: 'Great article! The mobile-first approach you mentioned really helped me understand the concept better.',
        dateCreated: '2023-05-23',
      }),
      mockComment({
        id: 'comment-3-2',
        userId: 'user-9',
        parent: 'post-3',
        body: 'Bookmarked this for later. Thanks for sharing your insights!',
        dateCreated: '2023-05-23',
      }),
    ],
  }),
  mockComment({
    id: 'post-4',
    userId: 'user-4',
    body: 'Check out this amazing resource for free stock photos: https://unsplash.com - I use it all the time for my design projects!',
    dateCreated: '2023-05-22',
    voteNum: 119,
    children: [
      mockComment({
        id: 'comment-4-1',
        userId: 'user-10',
        parent: 'post-4',
        body: 'Unsplash is my go-to as well! The quality is incredible for free images.',
        dateCreated: '2023-05-22',
      }),
    ],
  }),
];

/** @deprecated Use mockComments */
export const mockPosts = mockComments;

export function getCommentsByUserId(userId: string): Comment[] {
  return mockComments.filter((comment) => comment.user.id === userId);
}

/** @deprecated Use getCommentsByUserId */
export function getPostsByUserId(userId: string): Comment[] {
  return getCommentsByUserId(userId);
}

export function getCommentById(id: string): Comment | undefined {
  return mockComments.find((comment) => comment.id === id);
}

/** @deprecated Use getCommentById */
export function getPostById(id: string): Comment | undefined {
  return getCommentById(id);
}
