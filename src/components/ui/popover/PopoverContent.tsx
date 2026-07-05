import * as Popover from '@radix-ui/react-popover';
import { panelStyles } from '@/components/ui/panel';
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
        className={twMerge(
          panelStyles.surface,
          panelStyles.content,
          'z-50 p-2',
          width,
          className,
        )}
        sideOffset={8}
        align="end"
      >
        <div className="space-y-1">{children}</div>
        <Popover.Arrow className="fill-panel" />
      </Popover.Content>
    </Popover.Portal>
  );
}
