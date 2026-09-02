import { PostActionButton } from '@/components/post/PostActionButton';
import { Tooltip } from '@/components/ui/Tooltip';
import { LazyEmojiPicker } from '@/components/ui/EmojiPicker/LazyEmojiPicker';
import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface EmojiReactionProps {
  reactions: { [key: string]: number };
  onReaction: (emoji: string) => void;
}

/**
 * EmojiReaction - A component for adding emoji reactions to posts using Frimousse emoji picker
 * Shows the top 4 emoji reactions with their counts and provides a full emoji picker
 */
export function EmojiReaction({ reactions, onReaction }: EmojiReactionProps) {
  const { t } = useTranslation();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const label = t('posts:addReaction');

  const topReactions = Object.entries(reactions)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 4);

  const handleEmojiSelect = (emoji: string) => {
    onReaction(emoji);
    setEmojiPickerOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2">
        {topReactions.map(([emoji, count]) => (
          <PostActionButton
            key={emoji}
            icon={<span className="text-xs">{emoji}</span>}
            count={count}
            label={t('posts:reactWith', { emoji })}
            onClick={() => onReaction(emoji)}
            className="h-10 px-3"
          />
        ))}

        <Popover.Root open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
          <Tooltip content={label}>
            <Popover.Trigger asChild>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 transition-all duration-200 hover:bg-black/10 hover:shadow-md dark:bg-black/10 dark:hover:bg-black/20"
                aria-label={label}
                aria-expanded={emojiPickerOpen}
                aria-haspopup="dialog"
                tabIndex={0}
              >
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
                  aria-hidden
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
          </Tooltip>

          <Popover.Portal>
            <Popover.Content className="z-50" sideOffset={8} align="start">
              <LazyEmojiPicker
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
