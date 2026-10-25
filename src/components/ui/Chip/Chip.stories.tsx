import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from './Chip';

const meta = {
  title: 'UI/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Card>
        <Story />
      </Card>
    ),
  ],
  args: {
    children: 'Ada',
    removeLabel: 'Remove Ada',
    onRemove: () => undefined,
  },
  argTypes: {
    onRemove: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLeading: Story = {
  args: {
    leading: <Avatar alt="" className="size-5" />,
  },
};
