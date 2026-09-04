import { withRouter } from '../../../../.storybook/decorators/withRouter';
import {
  NAV_RAIL_COLLAPSED_WIDTH,
  NAV_RAIL_EXPANDED_WIDTH,
  navRailSectionClassName,
} from '@/components/navigation/navRailLayout';
import { TooltipProvider } from '@/components/ui/Tooltip';
import type { Meta, StoryObj } from '@storybook/react-vite';
import clsx from 'clsx';
import { Compass, LayoutDashboard, Rss } from 'lucide-react';
import type { ComponentProps } from 'react';
import { NavRailLink } from './NavRailLink';

type NavRailLinkStoryArgs = ComponentProps<typeof NavRailLink>;

const meta = {
  title: 'Navigation/NavRailLink',
  component: NavRailLink,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    withRouter,
    (Story, context) => {
      const expanded = Boolean(context.args.expanded);
      return (
        <TooltipProvider delayDuration={0}>
          <div
            className={clsx(
              'bg-background',
              navRailSectionClassName,
              expanded ? NAV_RAIL_EXPANDED_WIDTH : NAV_RAIL_COLLAPSED_WIDTH,
            )}
          >
            <Story />
          </div>
        </TooltipProvider>
      );
    },
  ],
  args: {
    to: '/feed',
    label: 'Feed',
    icon: Rss,
    expanded: true,
    exact: false,
    count: 0,
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
} satisfies Meta<NavRailLinkStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Collapsed: Story = {
  args: {
    expanded: false,
  },
};

export const Active: Story = {
  args: {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
};

export const ActiveCollapsed: Story = {
  args: {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    exact: true,
    expanded: false,
  },
};

export const WithCount: Story = {
  args: {
    count: 12,
  },
};

export const CollapsedWithCount: Story = {
  args: {
    expanded: false,
    count: 12,
  },
};

export const Disabled: Story = {
  args: {
    to: '/explore',
    label: 'Explore',
    icon: Compass,
    exact: false,
    disabled: true,
  },
};
