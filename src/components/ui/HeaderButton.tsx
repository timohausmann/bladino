import {
  headerButtonVariants,
  type HeaderButtonShape,
  type HeaderButtonVariant,
} from '@/components/ui/headerButtonVariants';
import { Tooltip } from '@/components/ui/Tooltip';
import { forwardRef, type ReactNode } from 'react';

interface HeaderButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  className?: string;
  active?: boolean;
  variant?: HeaderButtonVariant;
  shape?: HeaderButtonShape;
  /** Set when an outer Tooltip or Radix `asChild` parent wraps the button. */
  disableTooltip?: boolean;
}

/**
 * HeaderButton - A reusable button component for header actions.
 *
 * Variants:
 * - default: transparent with neutral hover
 * - persistent: subtle background with enhanced hover
 * - dangerous: rose accent for destructive actions
 */
export const HeaderButton = forwardRef<HTMLButtonElement, HeaderButtonProps>(
  function HeaderButton(
    {
      icon,
      label,
      className = '',
      active = false,
      variant = 'default',
      shape = 'round',
      disabled = false,
      disableTooltip = false,
      tabIndex,
      ...buttonProps
    },
    ref,
  ) {
    const button = (
      <button
        {...buttonProps}
        ref={ref}
        disabled={disabled}
        tabIndex={disabled ? -1 : (tabIndex ?? 0)}
        className={headerButtonVariants({
          variant,
          shape,
          active,
          disabled,
          className,
        })}
        aria-label={label}
      >
        {icon}
      </button>
    );

    if (disableTooltip) {
      return button;
    }

    return <Tooltip content={label}>{button}</Tooltip>;
  },
);
