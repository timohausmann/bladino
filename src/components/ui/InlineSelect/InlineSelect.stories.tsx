import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { InlineSelect, type InlineSelectProps } from './InlineSelect';

type SelectValue = 'inbox' | 'outbox';
type InlineSelectStoryArgs = InlineSelectProps<SelectValue>;

const options = [
  { value: 'inbox', label: 'Inbox' },
  { value: 'outbox', label: 'Outbox' },
] satisfies InlineSelectStoryArgs['options'];

const ControlledInlineSelect = (args: InlineSelectStoryArgs) => {
  const [value, setValue] = useState(args.value);

  const handleValueChange = (nextValue: SelectValue) => {
    setValue(nextValue);
    args.onValueChange(nextValue);
  };

  return (
    <InlineSelect {...args} value={value} onValueChange={handleValueChange} />
  );
};

const meta = {
  title: 'UI/InlineSelect',
  component: InlineSelect,
  parameters: {
    layout: 'centered',
  },
  args: {
    value: 'inbox',
    onValueChange: () => undefined,
    options,
    ariaLabel: 'Mail folder',
    placeholder: 'Select a folder',
    disabled: false,
  },
  argTypes: {
    value: {
      control: false,
    },
    onValueChange: {
      table: { disable: true },
    },
    options: {
      table: { disable: true },
    },
  },
  render: ControlledInlineSelect,
} satisfies Meta<InlineSelectStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Placeholder: Story = {
  args: {
    value: undefined,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
