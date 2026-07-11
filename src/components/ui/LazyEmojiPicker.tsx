import { panelStyles } from '@/components/ui/panel';
import { lazy, Suspense, type ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

const EmojiPickerPanel = lazy(() =>
  import('./EmojiPicker').then((module) => ({ default: module.EmojiPicker })),
);

type EmojiPickerProps = ComponentProps<typeof EmojiPickerPanel>;

/**
 * Lazy-loads frimousse only when the emoji popover is opened.
 */
export function LazyEmojiPicker(props: EmojiPickerProps) {
  return (
    <Suspense
      fallback={
        <div
          className={twMerge(
            panelStyles.surface,
            panelStyles.dropdownContent,
            'flex h-[368px] w-64 items-center justify-center',
          )}
          aria-hidden
        />
      }
    >
      <EmojiPickerPanel {...props} />
    </Suspense>
  );
}
