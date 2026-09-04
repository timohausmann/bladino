import { withRouter } from '../../../../.storybook/decorators/withRouter';
import {
  NAV_RAIL_COLLAPSED_WIDTH,
  NAV_RAIL_EXPANDED_WIDTH,
  navRailSectionClassName,
} from '@/components/navigation/navRailLayout';
import { TooltipProvider } from '@/components/ui/Tooltip';
import type { Meta, StoryObj } from '@storybook/react-vite';
import clsx from 'clsx';
import type { ComponentProps } from 'react';
import { NotificationButton } from './NotificationButton';

type NotificationButtonStoryArgs = ComponentProps<typeof NotificationButton>;

const meta = {
  title: 'Navigation/NotificationButton',
  component: NotificationButton,
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
    expanded: true,
    count: 0,
  },
} satisfies Meta<NotificationButtonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: {
    count: 8,
  },
};

export const Collapsed: Story = {
  args: {
    expanded: false,
  },
};

export const WithCount: Story = {
  args: {
    expanded: false,
    count: 8,
  },
};
