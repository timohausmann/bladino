import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  args: {
    size: 20,
  },
  argTypes: {
    size: {
      control: { type: 'number', min: 8, max: 96, step: 2 },
    },
    className: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
