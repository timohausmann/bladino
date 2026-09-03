import type { Meta, StoryObj } from '@storybook/react-vite';
import { Info } from 'lucide-react';
import { Tooltip, TooltipProvider } from './Tooltip';

const sideOptions = ['top', 'right', 'bottom', 'left'] as const;

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={0}>
        <Story />
      </TooltipProvider>
    ),
  ],
  args: {
    content: 'Helpful context',
    side: 'bottom',
    children: (
      <button className="bg-primary rounded-md px-4 py-2 text-white">
        Hover or focus me
      </button>
    ),
  },
  argTypes: {
    side: {
      control: 'inline-radio',
      options: sideOptions,
    },
    children: {
      table: { disable: true },
    },
    className: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SideVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: (args) => (
    <div className="grid grid-cols-2 gap-10 p-16">
      {sideOptions.map((side) => (
        <Tooltip
          key={side}
          {...args}
          side={side}
          content={`Tooltip on ${side}`}
        >
          <button className="bg-inset rounded-md px-4 py-2 capitalize">
            {side}
          </button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const IconTrigger: Story = {
  args: {
    content: 'More information',
    children: (
      <button
        className="bg-inset rounded-full p-2"
        aria-label="More information"
      >
        <Info size={20} aria-hidden />
      </button>
    ),
  },
};

export const LongContent: Story = {
  args: {
    content:
      'Tooltips can provide a little more context when a short label is not enough.',
    className: 'max-w-64 text-center leading-relaxed',
  },
};
