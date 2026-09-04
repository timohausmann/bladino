import { withRouter } from '../../../../.storybook/decorators/withRouter';
import { TooltipProvider } from '@/components/ui/Tooltip';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Settings } from 'lucide-react';
import type { ComponentProps } from 'react';
import { NavRailIconLink } from './NavRailIconLink';

type NavRailIconLinkStoryArgs = ComponentProps<typeof NavRailIconLink>;

const meta = {
  title: 'Navigation/NavRailIconLink',
  component: NavRailIconLink,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    withRouter,
    (Story) => (
      <TooltipProvider delayDuration={0}>
        <Story />
      </TooltipProvider>
    ),
  ],
  args: {
    to: '/settings',
    label: 'Settings',
    icon: Settings,
    disabled: false,
  },
  argTypes: {
    icon: {
      table: { disable: true },
    },
    params: {
      table: { disable: true },
    },
  },
} satisfies Meta<NavRailIconLinkStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
