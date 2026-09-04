import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus, Trash2 } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { IconButton } from './IconButton';
import type {
  IconButtonShape,
  IconButtonSize,
  IconButtonVariant,
} from './iconButtonVariants';

const variants: IconButtonVariant[] = ['default', 'persistent', 'dangerous'];
const shapes: IconButtonShape[] = ['circle', 'rounded-square'];
const sizes: IconButtonSize[] = ['default', 'sm'];

const meta = {
  title: 'UI/IconButton',
  component: IconButton,
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
    icon: <Plus size={18} aria-hidden />,
    label: 'Open menu',
    variant: 'default',
    shape: 'circle',
    size: 'default',
    active: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
    },
    shape: {
      control: 'inline-radio',
      options: shapes,
    },
    size: {
      control: 'inline-radio',
      options: sizes,
    },
    icon: {
      table: { disable: true },
    },
    onClick: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Persistent: Story = {
  args: {
    variant: 'persistent',
  },
};

export const Dangerous: Story = {
  args: {
    icon: <Trash2 size={18} aria-hidden />,
    label: 'Delete item',
    variant: 'dangerous',
  },
};

export const SmallRoundedSquare: Story = {
  args: {
    shape: 'rounded-square',
    size: 'sm',
  },
};

export const Active: Story = {
  args: {
    active: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const VariantMatrix: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="bg-surface grid gap-5 rounded-xl border border-black/10 p-6 dark:border-white/10">
      {variants.map((variant) => (
        <div key={variant} className="grid grid-cols-4 items-center gap-4">
          <span className="text-muted-foreground text-sm capitalize">
            {variant}
          </span>
          <IconButton
            icon={<Plus size={18} aria-hidden />}
            label={`${variant} button`}
            variant={variant}
          />
          <IconButton
            icon={<Plus size={18} aria-hidden />}
            label={`${variant} active button`}
            variant={variant}
            active
          />
          <IconButton
            icon={<Plus size={18} aria-hidden />}
            label={`${variant} disabled button`}
            variant={variant}
            disabled
          />
        </div>
      ))}
    </div>
  ),
};
