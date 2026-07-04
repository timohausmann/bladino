import { lazy, Suspense, type ComponentProps } from 'react';

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
          className="flex h-[368px] w-64 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800"
          aria-hidden
        />
      }
    >
      <EmojiPickerPanel {...props} />
    </Suspense>
  );
}
