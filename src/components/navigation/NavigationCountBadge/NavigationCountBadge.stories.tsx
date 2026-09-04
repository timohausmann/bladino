import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { NavigationCountBadge } from './NavigationCountBadge';

type NavigationCountBadgeStoryArgs = ComponentProps<
  typeof NavigationCountBadge
>;

const meta = {
  title: 'Navigation/NavigationCountBadge',
  component: NavigationCountBadge,
  parameters: {
    layout: 'centered',
  },
  args: {
    count: 3,
    size: 'default',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['default', 'compact'],
    },
    className: {
      table: { disable: true },
    },
  },
} satisfies Meta<NavigationCountBadgeStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Overflow: Story = {
  args: {
    count: 100,
  },
};

export const Compact: Story = {
  args: {
    size: 'compact',
  },
};
