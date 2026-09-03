import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { Banner } from './Banner';

type BannerVariant = ComponentProps<typeof Banner>['variant'];

const variants: BannerVariant[] = ['positive', 'negative', 'info'];

const messages: Record<BannerVariant, string> = {
  positive: 'Your changes were saved successfully.',
  negative: 'We could not save your changes.',
  info: 'A new version is available.',
};

const meta = {
  title: 'UI/Banner',
  component: Banner,
  parameters: {
    layout: 'centered',
  },
  args: {
    message: messages.info,
    variant: 'info',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: variants,
    },
    message: {
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Positive: Story = {
  args: {
    message: messages.positive,
    variant: 'positive',
  },
};

export const Negative: Story = {
  args: {
    message: messages.negative,
    variant: 'negative',
  },
};

export const Info: Story = {
  args: {
    message: messages.info,
    variant: 'info',
  },
};

export const VariantMatrix: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="space-y-3">
      {variants.map((variant) => (
        <Banner key={variant} message={messages[variant]} variant={variant} />
      ))}
    </div>
  ),
};
