import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ComponentProps } from 'react';
import { SearchMask } from './SearchMask';

const users = [
  { id: '1', name: 'Ada' },
  { id: '2', name: 'Grace' },
];

const channels = [
  { id: 'a', name: 'general' },
  { id: 'b', name: 'dev' },
];

type SearchMaskStoryArgs = ComponentProps<typeof SearchMask>;

const StatefulSearchMask = ({
  query: initialQuery,
  filters: initialFilters,
}: SearchMaskStoryArgs) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(initialFilters);

  return (
    <div className="w-full max-w-2xl">
      <SearchMask
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        onFiltersChange={(patch) =>
          setFilters((current) => ({ ...current, ...patch }))
        }
        onClearFilters={() => setFilters({})}
        users={users}
        channels={channels}
      />
    </div>
  );
};

const meta = {
  title: 'Search/SearchMask',
  component: SearchMask,
  parameters: {
    layout: 'padded',
  },
  args: {
    query: '',
    filters: {},
    users,
    channels,
    usersLoading: false,
    channelsLoading: false,
    onQueryChange: () => undefined,
    onFiltersChange: () => undefined,
    onClearFilters: () => undefined,
  },
  argTypes: {
    query: { control: false },
    filters: { table: { disable: true } },
    users: { table: { disable: true } },
    channels: { table: { disable: true } },
    onQueryChange: { table: { disable: true } },
    onFiltersChange: { table: { disable: true } },
    onClearFilters: { table: { disable: true } },
  },
  render: StatefulSearchMask,
} satisfies Meta<typeof SearchMask>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Active: Story = {
  args: {
    query: 'raster',
    filters: {
      user: '1',
      range: 'custom',
      from: '2026-01-01',
      to: '2026-02-01',
      channel: 'a',
      type: 'post',
      liked: true,
    },
  },
};
