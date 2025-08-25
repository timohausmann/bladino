import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';

interface PopoverContentProps {
    children: React.ReactNode;
    /** Width of the popover (default: w-48) */
    width?: string;
    className?: string;
}

/**
 * Reusable popover content component with consistent styling
 */
export function PopoverContent({
    children,
    width = 'w-48',
    className
}: PopoverContentProps) {
    return (
        <Popover.Portal>
            <Popover.Content
                className={clsx(
                    "z-50 rounded-lg bg-white dark:bg-neutral-900 p-2 shadow-lg border border-neutral-200 dark:border-neutral-700",
                    width,
                    className
                )}
                sideOffset={8}
                align="end"
            >
                <div className="space-y-1">
                    {children}
                </div>
                <Popover.Arrow className="fill-white dark:fill-neutral-700" />
            </Popover.Content>
        </Popover.Portal>
    );
}
