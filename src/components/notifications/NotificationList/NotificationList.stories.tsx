import { withRouter } from '../../../../.storybook/decorators/withRouter';
import type { NotificationItem } from '@/components/notifications/notificationUtils';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { NotificationList } from './NotificationList';

type NotificationListStoryArgs = ComponentProps<typeof NotificationList>;

const minutesAgo = (minutes: number): string =>
  new Date(Date.now() - minutes * 60 * 1000).toISOString();

const createNotification = (
  overrides: Partial<NotificationItem> & Pick<NotificationItem, 'id'>,
): NotificationItem => ({
  type: 'COMMENT_LIKED',
  dateCreated: minutesAgo(4),
  dateRead: null,
  actorLabel: null,
  subjectType: 'COMMENT',
  subjectId: 'post-1',
  parentId: null,
  actor: {
    id: 'user-2',
    name: 'Alex Johnson',
    avatar: null,
  },
  ...overrides,
});

const unreadLiked = createNotification({
  id: 'liked-unread',
  type: 'COMMENT_LIKED',
  dateCreated: minutesAgo(2),
});

const unreadReplied = createNotification({
  id: 'replied-unread',
  type: 'COMMENT_REPLIED_TO',
  dateCreated: minutesAgo(8),
  parentId: 'post-1',
  subjectId: 'comment-1',
  actor: {
    id: 'user-3',
    name: 'Sophia Chen',
    avatar: null,
  },
});

const readLiked = createNotification({
  id: 'liked-read',
  type: 'COMMENT_LIKED',
  dateCreated: minutesAgo(40),
  dateRead: minutesAgo(10),
  actor: {
    id: 'user-4',
    name: 'Marcus Williams',
    avatar: null,
  },
});

const readReplied = createNotification({
  id: 'replied-read',
  type: 'COMMENT_REPLIED_TO',
  dateCreated: minutesAgo(120),
  dateRead: minutesAgo(90),
  parentId: 'post-1',
  subjectId: 'comment-2',
  actor: {
    id: 'user-1',
    name: 'Jane Smith',
    avatar: null,
  },
});

const meta = {
  title: 'Notifications/NotificationList',
  component: NotificationList,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    withRouter,
    (Story) => (
      <div className="bg-background w-full max-w-xl rounded-xl p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    notifications: [unreadLiked, unreadReplied, readLiked, readReplied],
  },
  argTypes: {
    notifications: {
      table: { disable: true },
    },
    onNotificationClick: {
      table: { disable: true },
    },
    className: {
      table: { disable: true },
    },
  },
} satisfies Meta<NotificationListStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
