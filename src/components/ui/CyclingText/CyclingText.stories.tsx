import type { Meta, StoryObj } from '@storybook/react-vite';
import { CyclingText } from './CyclingText';

const meta = {
  title: 'UI/CyclingText',
  component: CyclingText,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="text-muted-foreground w-80 text-center text-sm">
        <Story />
      </div>
    ),
  ],
  args: {
    items: [
      'Available for new projects',
      'Based in Copenhagen',
      'Usually replies within a day',
    ],
    visibleMs: 2000,
    fadeMs: 500,
  },
  argTypes: {
    items: {
      control: 'object',
    },
    visibleMs: {
      control: { type: 'range', min: 250, max: 10000, step: 250 },
    },
    fadeMs: {
      control: { type: 'range', min: 0, max: 2000, step: 50 },
    },
  },
} satisfies Meta<typeof CyclingText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleItem: Story = {
  args: {
    items: ['Available for new projects'],
  },
};

export const MultipleItems: Story = {};
