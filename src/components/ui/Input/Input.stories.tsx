import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ComponentProps } from 'react';
import { Input } from './Input';

type InputStoryArgs = ComponentProps<typeof Input>;

const ControlledInput = (args: InputStoryArgs) => {
  const [value, setValue] = useState(args.value);

  return (
    <div className="w-80">
      <Input {...args} value={value} onChange={setValue} />
    </div>
  );
};

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  args: {
    value: '',
    onChange: () => undefined,
    label: 'Display name',
    placeholder: 'Enter a display name',
    type: 'text',
    disabled: false,
    required: false,
    showPasswordToggle: false,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'url', 'search'],
    },
    value: {
      control: false,
    },
    onChange: {
      table: { disable: true },
    },
    maxLength: {
      control: { type: 'number', min: 1 },
    },
    hint: {
      control: 'text',
    },
  },
  render: ControlledInput,
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {};

export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    showPasswordToggle: true,
  },
};

export const Hint: Story = {
  args: {
    label: 'Username',
    placeholder: 'Choose a username',
    hint: 'Use 3–24 letters, numbers, or underscores.',
  },
};

export const Disabled: Story = {
  args: {
    value: 'Read-only value',
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    label: 'Email address',
    placeholder: 'name@example.com',
    type: 'email',
    required: true,
  },
};
