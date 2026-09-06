import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps, ReactNode } from 'react';
import { useState } from 'react';
import { CreateAddAttachment } from '@/components/create/CreateAddAttachment';
import { CreateAddEmoji } from '@/components/create/CreateAddEmoji';
import { Card } from '@/components/ui/Card';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { Textarea } from './Textarea';

interface StoryFrameProps {
  children: ReactNode;
}

const StoryFrame = ({ children }: StoryFrameProps) => (
  <Card className="w-lg max-w-[calc(100vw-2rem)]">{children}</Card>
);

interface ControlledTextareaProps {
  textareaProps: ComponentProps<typeof Textarea>;
}

const ControlledTextarea = ({ textareaProps }: ControlledTextareaProps) => {
  const [value, setValue] = useState(textareaProps.value);

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    textareaProps.onChange(nextValue);
  };

  return (
    <StoryFrame>
      <Textarea {...textareaProps} value={value} onChange={handleChange} />
    </StoryFrame>
  );
};

const EmojiTextarea = ({ textareaProps }: ControlledTextareaProps) => {
  const [value, setValue] = useState(textareaProps.value);

  const handleEmojiSelect = (emoji: string) => {
    setValue((currentValue) => `${currentValue}${emoji}`);
  };

  return (
    <TooltipProvider>
      <StoryFrame>
        <Textarea
          {...textareaProps}
          value={value}
          onChange={setValue}
          endAdornment={<CreateAddEmoji onEmojiSelect={handleEmojiSelect} />}
        />
      </StoryFrame>
    </TooltipProvider>
  );
};

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  args: {
    value: '',
    onChange: () => undefined,
    placeholder: 'Write something…',
    rows: 3,
    disabled: false,
    required: false,
    resize: 'resize-y',
    autoGrow: false,
  },
  argTypes: {
    value: {
      table: { disable: true },
    },
    onChange: {
      table: { disable: true },
    },
    resize: {
      control: 'select',
      options: ['resize-none', 'resize-y', 'resize-x', 'resize'],
    },
    endAdornment: {
      table: { disable: true },
    },
    onFocus: {
      table: { disable: true },
    },
    onBlur: {
      table: { disable: true },
    },
  },
  render: (args) => <ControlledTextarea textareaProps={args} />,
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {};

export const LabelAndRequired: Story = {
  args: {
    label: 'Message',
    required: true,
    placeholder: 'Enter a message',
  },
};

export const Disabled: Story = {
  args: {
    value: 'This textarea is unavailable.',
    disabled: true,
  },
};

export const AutoGrow: Story = {
  args: {
    value: 'This textarea grows as you add more lines.',
    rows: 1,
    autoGrow: true,
  },
};

export const Resizable: Story = {
  args: {
    value: 'Drag the resize handle.',
    resize: 'resize-y',
  },
};

export const WithEmojiPicker: Story = {
  args: {
    label: 'Post',
    placeholder: 'Share an update…',
  },
  render: (args) => <EmojiTextarea textareaProps={args} />,
};

const EndAdornmentsTextarea = ({ textareaProps }: ControlledTextareaProps) => {
  const [value, setValue] = useState(textareaProps.value);

  const handleEmojiSelect = (emoji: string) => {
    setValue((currentValue) => `${currentValue}${emoji}`);
  };

  return (
    <TooltipProvider>
      <StoryFrame>
        <Textarea
          {...textareaProps}
          value={value}
          onChange={setValue}
          endAdornment={
            <>
              <span className="hidden md:contents">
                <CreateAddEmoji
                  onEmojiSelect={handleEmojiSelect}
                  shape="rounded-square"
                />
              </span>
              <CreateAddAttachment
                onAddFiles={() => undefined}
                shape="rounded-square"
              />
            </>
          }
        />
      </StoryFrame>
    </TooltipProvider>
  );
};

export const WithEndAdornments: Story = {
  args: {
    label: 'Post',
    placeholder: 'Share an update…',
    value:
      'Long enough that the line would run under the overlay buttons without the measured padding.',
  },
  render: (args) => <EndAdornmentsTextarea textareaProps={args} />,
};
