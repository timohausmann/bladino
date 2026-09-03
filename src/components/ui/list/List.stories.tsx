import type { Meta, StoryObj } from '@storybook/react-vite';
import { Archive, Inbox, Send } from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import { List } from './List';
import { ListItem } from './ListItem';

type ListStoryArgs = ComponentProps<typeof List>;
type ItemPresentation = 'title' | 'meta' | 'icon' | 'full';

const items = [
  {
    id: 'inbox',
    title: 'Inbox',
    meta: '12 unread messages',
    icon: Inbox,
  },
  {
    id: 'sent',
    title: 'Sent',
    meta: 'Updated 2 minutes ago',
    icon: Send,
  },
  {
    id: 'archive',
    title: 'Archive',
    meta: '48 saved messages',
    icon: Archive,
  },
] as const;

interface StatefulListProps {
  label?: string;
  className?: string;
  presentation: ItemPresentation;
}

const StatefulList = ({
  label,
  className,
  presentation,
}: StatefulListProps) => {
  const [activeId, setActiveId] = useState<string>(items[0].id);
  const showMeta = presentation === 'meta' || presentation === 'full';
  const showIcon = presentation === 'icon' || presentation === 'full';

  const handleSelect = (itemId: string) => {
    setActiveId(itemId);
  };

  return (
    <div className="flex h-64 w-80 flex-col overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
      <List label={label} className={className}>
        {items.map((item) => (
          <ListItem
            key={item.id}
            title={item.title}
            meta={showMeta ? item.meta : undefined}
            icon={showIcon ? item.icon : undefined}
            active={activeId === item.id}
            onClick={() => handleSelect(item.id)}
          />
        ))}
      </List>
    </div>
  );
};

const meta = {
  title: 'UI/List',
  component: List,
  parameters: {
    layout: 'centered',
  },
  args: {
    children: null,
    label: 'Message folders',
  },
  argTypes: {
    children: {
      table: { disable: true },
    },
    className: {
      table: { disable: true },
    },
  },
} satisfies Meta<ListStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  render: ({ label, className }) => (
    <StatefulList label={label} className={className} presentation="title" />
  ),
};

export const WithMeta: Story = {
  render: ({ label, className }) => (
    <StatefulList label={label} className={className} presentation="meta" />
  ),
};

export const WithIcon: Story = {
  render: ({ label, className }) => (
    <StatefulList label={label} className={className} presentation="icon" />
  ),
};

export const Full: Story = {
  render: ({ label, className }) => (
    <StatefulList label={label} className={className} presentation="full" />
  ),
};
