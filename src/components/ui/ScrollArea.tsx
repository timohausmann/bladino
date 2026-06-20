import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { twMerge } from 'tailwind-merge';

interface ScrollAreaProps {
    children: React.ReactNode;
    className?: string;
    /** Accessible label for the scroll region */
    label?: string;
}

/**
 * Constrained scroll container with a styled scrollbar.
 * Parent must provide a bounded height (e.g. flex-1 min-h-0 in a flex column).
 */
export function ScrollArea({ children, className, label }: ScrollAreaProps) {
    return (
        <ScrollAreaPrimitive.Root
            className={twMerge('relative overflow-hidden', className)}
            aria-label={label}
        >
            <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit] [&>div]:!block">
                {children}
            </ScrollAreaPrimitive.Viewport>
            <ScrollAreaPrimitive.Scrollbar
                orientation="vertical"
                className="flex w-2 touch-none select-none p-0.5 transition-colors"
            >
                <ScrollAreaPrimitive.Thumb
                    className="relative flex-1 rounded-full bg-neutral-300/80 dark:bg-neutral-600/80"
                />
            </ScrollAreaPrimitive.Scrollbar>
            <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
    );
}
