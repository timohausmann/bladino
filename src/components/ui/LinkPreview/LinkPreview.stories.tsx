import type { Meta, StoryObj } from '@storybook/react-vite';
import clsx from 'clsx';
import { LinkPreview } from './LinkPreview';

const previewImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
    <defs>
      <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#0891b2" />
        <stop offset="1" stop-color="#7c3aed" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#background)" />
    <circle cx="400" cy="220" r="86" fill="white" fill-opacity="0.18" />
    <text x="400" y="390" fill="white" font-family="sans-serif"
      font-size="52" text-anchor="middle">Design system</text>
  </svg>
`)}`;

const favicon = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill="#0891b2" />
    <path d="M18 18h28v28H18z" fill="white" fill-opacity="0.9" />
  </svg>
`)}`;

const meta = {
  title: 'UI/LinkPreview',
  component: LinkPreview,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story, context) => (
      <div
        className={clsx(
          'w-2xl max-w-[calc(100vw-2rem)] rounded-xl p-4',
          context.args.parentSurface === 'inset' ? 'bg-inset' : 'bg-surface',
        )}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    url: 'https://example.com/design-system',
    title: 'Building a consistent interface',
    description:
      'A practical guide to reusable components, shared design tokens, and accessible interaction patterns.',
    image: previewImage,
    icon: favicon,
    variant: 'default',
    parentSurface: 'surface',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'compact'],
    },
    parentSurface: {
      control: 'inline-radio',
      options: ['surface', 'inset'],
    },
  },
} satisfies Meta<typeof LinkPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    variant: 'compact',
  },
};

export const InsetSurface: Story = {
  args: {
    variant: 'compact',
    parentSurface: 'inset',
  },
};

export const WithoutImage: Story = {
  args: {
    image: undefined,
  },
};

export const MinimalMetadata: Story = {
  args: {
    title: undefined,
    description: undefined,
    image: undefined,
    icon: undefined,
    url: 'https://example.com',
  },
};
