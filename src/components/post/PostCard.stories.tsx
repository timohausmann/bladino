import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Comment } from '@/graphql';
import { mockComments } from '@/mocks';
import { withPostCardLayout } from '../../../.storybook/decorators/withPostProviders';
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
    },
  ],
};

const meta = {
  title: 'Post/PostCard',
  component: PostCard,
  decorators: withPostCardLayout,
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
