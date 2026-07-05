import { panelStyles } from '@/components/ui/panel';
import { EmojiPicker as FrimoussePicker } from 'frimousse';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const { t } = useTranslation();

  return (
    <FrimoussePicker.Root
      className={twMerge(
        panelStyles.surface,
        panelStyles.content,
        'isolate flex h-[368px] w-fit flex-col',
      )}
      onEmojiSelect={(emoji) => {
        onEmojiSelect(emoji.emoji);
        onClose();
      }}
    >
      <FrimoussePicker.Search className="z-10 mx-2 mt-2 appearance-none rounded-md bg-neutral-100 px-2.5 py-2 text-sm text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100" />
      <FrimoussePicker.Viewport className="relative flex-1 outline-hidden">
        <FrimoussePicker.Loading className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400 dark:text-neutral-400">
          {t('common:loading')}
        </FrimoussePicker.Loading>
        <FrimoussePicker.Empty className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400 dark:text-neutral-400">
          {t('common:noEmojiFound')}
        </FrimoussePicker.Empty>
        <FrimoussePicker.List
          className="pb-1.5 select-none"
          components={{
            CategoryHeader: ({ category, ...props }) => (
              <div
                className="bg-white px-3 pt-3 pb-1.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                {...props}
              >
                {category.label}
              </div>
            ),
            Row: ({ children, ...props }) => (
              <div className="scroll-my-1.5 px-1.5" {...props}>
                {children}
              </div>
            ),
            Emoji: ({ emoji, ...props }) => (
              <button
                className="flex size-8 items-center justify-center rounded-md text-lg hover:bg-neutral-100 data-[active]:bg-neutral-100 dark:hover:bg-neutral-700 dark:data-[active]:bg-neutral-700"
                {...props}
              >
                {emoji.emoji}
              </button>
            ),
          }}
        />
      </FrimoussePicker.Viewport>
    </FrimoussePicker.Root>
  );
}
