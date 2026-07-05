import * as Popover from '@radix-ui/react-popover';
import { twMerge } from 'tailwind-merge';

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
  className,
}: PopoverContentProps) {
  return (
    <Popover.Portal>
      <Popover.Content
        className={twMerge('panel-surface z-50', width, 'p-2', className)}
        sideOffset={8}
        align="end"
      >
        <div className="space-y-1">{children}</div>
        <Popover.Arrow className="fill-panel" />
      </Popover.Content>
    </Popover.Portal>
  );
}
