import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnimatedLogo } from './AnimatedLogo';

const meta = {
  title: 'UI/AnimatedLogo',
  component: AnimatedLogo,
  parameters: {
    layout: 'centered',
  },
  args: {
    animate: true,
    idle: true,
    entry: true,
    overlays: {},
    logoHeight: '4rem',
    padding: 42,
  },
  argTypes: {
    animate: {
      control: 'boolean',
    },
    idle: {
      control: 'boolean',
    },
    entry: {
      control: 'boolean',
    },
    overlays: {
      control: 'object',
    },
    logoHeight: {
      control: 'text',
    },
    totalHeight: {
      control: 'text',
    },
    padding: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
  },
} satisfies Meta<typeof AnimatedLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Static: Story = {
  args: {
    animate: false,
  },
};

export const IdleOnly: Story = {
  args: {
    entry: false,
  },
};

export const EntryOnly: Story = {
  args: {
    idle: false,
  },
};
