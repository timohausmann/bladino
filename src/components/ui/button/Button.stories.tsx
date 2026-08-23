import type { Meta, StoryObj } from '@storybook/react-vite';
import { Send, Trash2, UserPlus } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { Button } from './Button';
import type { ButtonAppearance, ButtonVariant } from './buttonVariants';

const variants: ButtonVariant[] = ['primary', 'secondary', 'dangerous'];
const appearances: ButtonAppearance[] = ['filled', 'outline'];

const icons = {
  none: null,
  send: <Send size={16} />,
  trash: <Trash2 size={16} />,
  user: <UserPlus size={16} />,
} satisfies Record<string, ReactNode>;

type ButtonStoryArgs = ComponentProps<typeof Button> & {
  fullWidth?: boolean;
  icon: keyof typeof icons;
};

const meta = {
  title: 'UI/Button',
  component: Button,
  args: {
    children: 'Button',
    variant: 'primary',
    appearance: 'filled',
    effect: 'glow',
    size: 'default',
    loading: false,
    disabled: false,
    fullWidth: false,
    icon: 'none',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
    },
    appearance: {
      control: 'select',
      options: appearances,
    },
    effect: {
      control: 'inline-radio',
      options: ['none', 'glow'],
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'sm'],
    },
    icon: {
      control: 'select',
      options: Object.keys(icons),
    },
    iconBefore: {
      table: { disable: true },
    },
    iconAfter: {
      table: { disable: true },
    },
    onClick: {
      table: { disable: true },
    },
  },
  render: ({ className, fullWidth, icon, ...args }) => (
    <Button
      {...args}
      iconBefore={icons[icon]}
      className={[fullWidth && 'w-full', className].filter(Boolean).join(' ')}
    />
  ),
} satisfies Meta<ButtonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithIcons: Story = {
  args: {
    children: 'Send message',
    icon: 'send',
    iconAfter: <Send size={16} className="rotate-180" />,
  },
};

export const Loading: Story = {
  args: {
    children: 'Saving',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Unavailable',
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    children: 'Small button',
    size: 'sm',
  },
};

export const VariantMatrix: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: (args) => (
    <div className="bg-surface max-w-3xl space-y-6 rounded-xl border border-black/10 p-6 dark:border-white/10">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Button variants</h2>
        <p className="text-muted-foreground text-sm">
          Filled, outline, disabled, and loading states from the button lab.
        </p>
      </div>

      <div className="grid gap-6">
        {variants.map((variant) => (
          <div key={variant} className="space-y-3">
            <h3 className="text-sm font-medium capitalize">{variant}</h3>
            <div className="flex flex-wrap gap-3">
              {appearances.map((appearance) => (
                <Button
                  key={appearance}
                  variant={variant}
                  appearance={appearance}
                  effect={args.effect}
                >
                  {appearance}
                </Button>
              ))}
              <Button variant={variant} appearance="filled" disabled>
                Disabled
              </Button>
              <Button variant={variant} appearance="filled" loading>
                Loading
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
