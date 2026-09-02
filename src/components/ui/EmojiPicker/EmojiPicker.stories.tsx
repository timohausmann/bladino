import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { EmojiPicker } from './EmojiPicker';

const meta = {
  title: 'UI/EmojiPicker',
  component: EmojiPicker,
  parameters: {
    layout: 'centered',
  },
  args: {
    onEmojiSelect: () => undefined,
    onClose: () => undefined,
  },
  argTypes: {
    onEmojiSelect: {
      table: { disable: true },
    },
    onClose: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof EmojiPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const SelectionFeedback = () => {
  const [selectedEmoji, setSelectedEmoji] = useState('None yet');
  const [closeCount, setCloseCount] = useState(0);

  const handleClose = () => {
    setCloseCount((count) => count + 1);
  };

  return (
    <div className="space-y-3">
      <div className="text-muted-foreground flex justify-between gap-6 text-sm">
        <span>Selected: {selectedEmoji}</span>
        <span>Close callbacks: {closeCount}</span>
      </div>
      <EmojiPicker onEmojiSelect={setSelectedEmoji} onClose={handleClose} />
    </div>
  );
};

export const WithSelectionFeedback: Story = {
  render: () => <SelectionFeedback />,
};
