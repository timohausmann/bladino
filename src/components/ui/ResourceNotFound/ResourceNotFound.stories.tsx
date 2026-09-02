import type { Meta, StoryObj } from '@storybook/react-vite';
import { ResourceNotFound } from './ResourceNotFound';

const resourceKinds = ['post', 'user', 'note', 'mail', 'channel'] as const;

const meta = {
  title: 'UI/ResourceNotFound',
  component: ResourceNotFound,
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
    detail: {
      control: 'text',
      description: 'Adds identifying context to the user description',
    },
    className: {
      control: 'text',
    },
  },
} satisfies Meta<typeof ResourceNotFound>;

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

export const NamedUser: Story = {
  args: {
    resource: 'user',
    detail: '@missing-user',
  },
};
