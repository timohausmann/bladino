import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimelineDivider } from './TimelineDivider';

const meta = {
  title: 'UI/TimelineDivider',
  component: TimelineDivider,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Earlier posts',
    showNewIndicator: false,
  },
  argTypes: {
    showNewIndicator: {
      control: 'boolean',
      description: 'Shows the primary-colored new-post indicator',
    },
  },
} satisfies Meta<typeof TimelineDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutNewIndicator: Story = {};

export const WithNewIndicator: Story = {
  args: {
    label: '10 new posts',
    showNewIndicator: true,
  },
};
