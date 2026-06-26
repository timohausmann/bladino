import { PostActionButton } from '@/components/post/PostActionButton';
import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import { EmojiPicker } from '@/components/ui/EmojiPicker';

// Define the props for the EmojiReaction component
interface EmojiReactionProps {
  reactions: { [key: string]: number };
  onReaction: (emoji: string) => void;
}

/**
 * EmojiReaction - A component for adding emoji reactions to posts using Frimousse emoji picker
 * Shows the top 4 emoji reactions with their counts and provides a full emoji picker
 */
export function EmojiReaction({ reactions, onReaction }: EmojiReactionProps) {
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  // Get the top 4 emoji reactions
  const topReactions = Object.entries(reactions)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 4);

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    onReaction(emoji);
    setEmojiPickerOpen(false);
  };

  return (
    <div className="relative">
      {/* Top reactions display */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Reaction bubbles with counts */}
        {topReactions.map(([emoji, count]) => (
          <PostActionButton
            key={emoji}
            icon={<span className="text-xs">{emoji}</span>}
            count={count}
            label={`React with ${emoji}`}
            onClick={() => onReaction(emoji)}
            className="h-10 px-3"
          />
        ))}

        {/* Add reaction button with mood-plus icon */}
        <Popover.Root open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
          <Popover.Trigger asChild>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 transition-all duration-200 hover:bg-black/10 hover:shadow-md dark:bg-black/10 dark:hover:bg-black/20"
              aria-label="Add a reaction"
              title="Add a reaction"
              aria-expanded={emojiPickerOpen}
              aria-haspopup="true"
              tabIndex={0}
            >
              {/* tabler mood-plus icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M20.985 12.528a9 9 0 1 0 -8.45 8.456" />
                <path d="M16 19h6" />
                <path d="M19 16v6" />
                <path d="M9 10h.01" />
                <path d="M15 10h.01" />
                <path d="M9.5 15c.658 .64 1.56 1 2.5 1s1.842 -.36 2.5 -1" />
              </svg>
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content className="z-50" sideOffset={8} align="start">
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setEmojiPickerOpen(false)}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
}
