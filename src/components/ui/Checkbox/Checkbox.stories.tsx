import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ComponentProps } from 'react';
import { Checkbox } from './Checkbox';

function StatefulCheckbox({
  checked: initialChecked = false,
  ...props
}: ComponentProps<typeof Checkbox>) {
  const [checked, setChecked] = useState(initialChecked);

  return <Checkbox {...props} checked={checked} onCheckedChange={setChecked} />;
}

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    // The canvas matches inset, so the page is painted with the surface token.
    backgrounds: {
      options: {
        surface: { name: 'Surface', value: 'var(--color-surface)' },
      },
    },
  },
  globals: {
    backgrounds: { value: 'surface' },
  },
  render: (args) => <StatefulCheckbox {...args} />,
  args: {
    checked: false,
    disabled: false,
  },
  argTypes: {
    onCheckedChange: { table: { disable: true } },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
