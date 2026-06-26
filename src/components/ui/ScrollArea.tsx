import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { twMerge } from 'tailwind-merge';

const thumbClassName =
  'relative flex-1 rounded-full bg-neutral-300/80 dark:bg-neutral-600/80';

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  /** Accessible label for the scroll region */
  label?: string;
  orientation?: 'vertical' | 'horizontal';
}

/**
 * Constrained scroll container with a styled scrollbar.
 * Vertical: parent must provide a bounded height (e.g. flex-1 min-h-0 in a flex column).
 * Horizontal: parent should provide width; content wider than the viewport scrolls.
 */
export function ScrollArea({
  children,
  className,
  label,
  orientation = 'vertical',
}: ScrollAreaProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <ScrollAreaPrimitive.Root
      className={twMerge(
        'relative overflow-hidden',
        isHorizontal && 'w-full',
        className,
      )}
      aria-label={label}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit] [&>div]:block!">
        {children}
      </ScrollAreaPrimitive.Viewport>
      {isHorizontal ? (
        <ScrollAreaPrimitive.Scrollbar
          orientation="horizontal"
          className="flex h-2.5 touch-none flex-col p-0.5 transition-colors select-none"
        >
          <ScrollAreaPrimitive.Thumb className={thumbClassName} />
        </ScrollAreaPrimitive.Scrollbar>
      ) : (
        <ScrollAreaPrimitive.Scrollbar
          orientation="vertical"
          className="flex w-2 touch-none p-0.5 transition-colors select-none"
        >
          <ScrollAreaPrimitive.Thumb className={thumbClassName} />
        </ScrollAreaPrimitive.Scrollbar>
      )}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}
