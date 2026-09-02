import type { Meta, StoryObj } from '@storybook/react-vite';
import { ResourceError } from './ResourceError';

const resourceKinds = ['post', 'user', 'note', 'mail', 'channel'] as const;

const meta = {
  title: 'UI/ResourceError',
  component: ResourceError,
  parameters: {
    layout: 'centered',
  },
  args: {
    resource: 'post',
  },
  argTypes: {
    resource: {
      control: 'select',
      options: resourceKinds,
    },
    message: {
      control: 'text',
    },
    className: {
      control: 'text',
    },
  },
} satisfies Meta<typeof ResourceError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Post: Story = {};

export const User: Story = {
  args: {
    resource: 'user',
  },
};

export const Note: Story = {
  args: {
    resource: 'note',
  },
};

export const Mail: Story = {
  args: {
    resource: 'mail',
  },
};

export const Channel: Story = {
  args: {
    resource: 'channel',
  },
};

export const CustomMessage: Story = {
  args: {
    resource: 'post',
    message: 'The server timed out before the post could be loaded.',
  },
};
