import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Comment } from '@/graphql';
import { getUserById, mockComments } from '@/mocks';
import { withPostCard } from '../../../.storybook/decorators/withPostCard';
import { PostCard } from './PostCard';

const commentOptions = Object.fromEntries(
  mockComments.map((comment) => [comment.id, comment]),
) as Record<string, Comment>;

const textOnlyComment = commentOptions['post-4'];

const withLinkUrl =
  'https://medium.com/someverylongpathname/article-about-responsive-design-that-would-normally-be-too-long-to-display-properly';

const withLinkComment: Comment = {
  ...textOnlyComment,
  id: 'post-with-link',
  body: `Just read this great article: ${withLinkUrl}`,
  children: [],
  files: [],
  weblinks: [
    {
      id: 'weblink-1',
      url: withLinkUrl,
      alias: [withLinkUrl],
      title: 'Responsive Design Patterns',
      descr: 'A practical guide to mobile-first responsive layouts.',
      image: 'https://picsum.photos/800/420',
      icon: null,
      dateCreated: '2023-05-25',
    },
  ],
};

const replyLinkUrl = 'https://example.com/design-system-guide';

const fullComment: Comment = {
  ...textOnlyComment,
  id: 'post-full',
  body: `Shipped a new release with docs and screenshots. Full write-up: ${withLinkUrl}`,
  voteNum: 42,
  files: [
    {
      id: 'file-full-1',
      user: getUserById('user-4')!,
      filename: '/mockfiles/image-landscape.jpeg',
      name: 'release-screenshot.jpeg',
      type: 'image/jpeg',
      size: 71000,
    },
    {
      id: 'file-full-2',
      user: getUserById('user-4')!,
      filename: '/mockfiles/dummy.pdf',
      name: 'release-notes.pdf',
      type: 'application/pdf',
      size: 13000,
    },
  ],
  weblinks: [
    {
      id: 'weblink-full-1',
      url: withLinkUrl,
      alias: [withLinkUrl],
      title: 'Responsive Design Patterns',
      descr: 'A practical guide to mobile-first responsive layouts.',
      image: 'https://picsum.photos/800/420',
      icon: null,
      dateCreated: '2023-05-25',
    },
  ],
  children: [
    {
      id: 'comment-full-1',
      user: getUserById('user-5')!,
      parent: 'post-full',
      body: `Love it — here's a related guide: ${replyLinkUrl}`,
      dateCreated: '2023-05-25',
      weblinks: [
        {
          id: 'weblink-reply-1',
          url: replyLinkUrl,
          alias: [replyLinkUrl],
          title: 'Design System Guide',
          descr: 'Tokens, surfaces, and component conventions.',
          image: 'https://picsum.photos/640/360',
          icon: null,
          dateCreated: '2023-05-25',
        },
      ],
      files: [
        {
          id: 'file-reply-1',
          user: getUserById('user-5')!,
          filename: '/mockfiles/dummy.pdf',
          name: 'feedback-sketch.pdf',
          type: 'application/pdf',
          size: 13000,
        },
      ],
    },
  ],
};

const meta = {
  title: 'Post/PostCard',
  component: PostCard,
  decorators: withPostCard,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    comment: textOnlyComment,
    isUnread: false,
  },
  argTypes: {
    comment: {
      control: 'select',
      options: Object.keys(commentOptions),
      mapping: commentOptions,
      description: 'Mock comment shown in the card',
    },
    isUnread: {
      control: 'boolean',
      description: 'Shows the unread dot beside the author name',
    },
    onDeleted: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextOnly: Story = {
  args: {
    comment: textOnlyComment,
  },
};

export const WithLink: Story = {
  args: {
    ...TextOnly.args,
    comment: withLinkComment,
  },
};

export const Unread: Story = {
  args: {
    ...TextOnly.args,
    isUnread: true,
  },
};

export const WithAttachments: Story = {
  args: {
    ...TextOnly.args,
    comment: commentOptions['post-1'],
  },
};

export const WithReplies: Story = {
  args: {
    ...TextOnly.args,
    comment: commentOptions['post-3'],
  },
};

export const HighlightedReply: Story = {
  args: {
    ...WithReplies.args,
    highlightedCommentId: 'comment-3-1',
  },
};

export const Full: Story = {
  args: {
    ...TextOnly.args,
    comment: fullComment,
  },
};
