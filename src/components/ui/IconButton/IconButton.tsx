import { Tooltip } from '@/components/ui/Tooltip';
import { forwardRef, type ReactNode } from 'react';
import {
  iconButtonVariants,
  type IconButtonShape,
  type IconButtonSize,
  type IconButtonVariant,
} from './iconButtonVariants';

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  className?: string;
  active?: boolean;
  variant?: IconButtonVariant;
  shape?: IconButtonShape;
  size?: IconButtonSize;
  /** Set when an outer Tooltip or Radix `asChild` parent wraps the button. */
  disableTooltip?: boolean;
}

/**
 * Compact icon-only button with an accessible label and optional tooltip.
 *
 * Variants:
 * - default: transparent with neutral hover
 * - persistent: subtle background with enhanced hover
 * - dangerous: rose accent for destructive actions
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      icon,
      label,
      className = '',
      active = false,
      variant = 'default',
      shape = 'circle',
      size = 'default',
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
        className={iconButtonVariants({
          variant,
          shape,
          size,
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
