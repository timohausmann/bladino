import type { Meta, StoryObj } from '@storybook/react-vite';
import clsx from 'clsx';
import { useState, type ComponentProps } from 'react';
import { FilePreview } from './FilePreview';

type FilePreviewStoryArgs = ComponentProps<typeof FilePreview>;
type PreviewFile = FilePreviewStoryArgs['files'][number];

const createImageDataUrl = (
  label: string,
  startColor: string,
  endColor: string,
) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
      <defs>
        <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="${startColor}" />
          <stop offset="1" stop-color="${endColor}" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#background)" />
      <text x="400" y="270" fill="white" font-family="sans-serif"
        font-size="54" text-anchor="middle">${label}</text>
    </svg>
  `)}`;

const imageFiles = [
  {
    id: 'image-aurora',
    filename: 'aurora.svg',
    name: 'Aurora',
    type: 'image/svg+xml',
    size: 182_400,
    url: createImageDataUrl('Aurora', '#0891b2', '#7c3aed'),
  },
  {
    id: 'image-sunset',
    filename: 'sunset.svg',
    name: 'Sunset',
    type: 'image/svg+xml',
    size: 245_760,
    url: createImageDataUrl('Sunset', '#f97316', '#db2777'),
  },
  {
    id: 'image-ocean',
    filename: 'ocean.svg',
    name: 'Ocean',
    type: 'image/svg+xml',
    size: 215_040,
    url: createImageDataUrl('Ocean', '#0284c7', '#0f766e'),
  },
  {
    id: 'image-forest',
    filename: 'forest.svg',
    name: 'Forest',
    type: 'image/svg+xml',
    size: 194_560,
    url: createImageDataUrl('Forest', '#15803d', '#65a30d'),
  },
  {
    id: 'image-night',
    filename: 'night.svg',
    name: 'Night',
    type: 'image/svg+xml',
    size: 276_480,
    url: createImageDataUrl('Night', '#1e3a8a', '#581c87'),
  },
] satisfies PreviewFile[];

const mixedFiles = [
  {
    id: 'document',
    filename: 'project-brief.pdf',
    name: 'Project brief',
    type: 'application/pdf',
    size: 1_572_864,
  },
  {
    id: 'video',
    filename: 'demo.mp4',
    name: 'Product demo',
    type: 'video/mp4',
    size: 18_874_368,
  },
  {
    id: 'audio',
    filename: 'interview.mp3',
    name: 'Interview',
    type: 'audio/mpeg',
    size: 5_242_880,
  },
  {
    id: 'archive',
    filename: 'source-files.zip',
    name: 'Source files',
    type: 'application/zip',
    size: 8_388_608,
  },
] satisfies PreviewFile[];

const RemovableFilePreview = (args: FilePreviewStoryArgs) => {
  const [files, setFiles] = useState(args.files);

  const handleRemove = (fileId: string) => {
    setFiles((currentFiles) =>
      currentFiles.filter((file) => file.id !== fileId),
    );
  };

  return <FilePreview {...args} files={files} onRemove={handleRemove} />;
};

const meta = {
  title: 'UI/FilePreview',
  component: FilePreview,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story, context) => (
      <div
        className={clsx(
          'border-surface-border w-2xl max-w-[calc(100vw-2rem)] rounded-xl border p-4',
          context.args.parentSurface === 'inset' ? 'bg-inset' : 'bg-surface',
        )}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    files: imageFiles.slice(0, 1),
    compact: false,
    parentSurface: 'surface',
  },
  argTypes: {
    files: {
      table: { disable: true },
    },
    onRemove: {
      table: { disable: true },
    },
    parentSurface: {
      control: 'inline-radio',
      options: ['surface', 'inset'],
    },
  },
} satisfies Meta<typeof FilePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const Double: Story = {
  args: {
    files: imageFiles.slice(0, 2),
  },
};

export const Triple: Story = {
  args: {
    files: imageFiles.slice(0, 3),
  },
};

export const Multiple: Story = {
  args: {
    files: imageFiles,
  },
};

export const Compact: Story = {
  args: {
    files: imageFiles.slice(0, 2),
    compact: true,
  },
};

export const InsetSurface: Story = {
  args: {
    files: mixedFiles.slice(1, 3),
    parentSurface: 'inset',
  },
};

export const MixedFileTypes: Story = {
  args: {
    files: mixedFiles,
  },
};

export const Removable: Story = {
  args: {
    files: mixedFiles,
  },
  render: (args) => <RemovableFilePreview {...args} />,
};
