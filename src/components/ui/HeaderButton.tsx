import {
  headerButtonVariants,
  type HeaderButtonVariant,
} from '@/components/ui/headerButtonVariants';
import { ReactNode } from 'react';

interface HeaderButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  title?: string;
  className?: string;
  active?: boolean;
  variant?: HeaderButtonVariant;
}

/**
 * HeaderButton - A reusable button component for header actions.
 *
 * Variants:
 * - default: transparent with neutral hover
 * - persistent: subtle background with enhanced hover
 * - dangerous: rose accent for destructive actions
 */
export function HeaderButton({
  icon,
  label,
  className = '',
  active = false,
  variant = 'default',
  disabled = false,
  tabIndex,
  ...buttonProps
}: HeaderButtonProps) {
  return (
    <button
      {...buttonProps}
      disabled={disabled}
      tabIndex={disabled ? -1 : (tabIndex ?? 0)}
      className={headerButtonVariants({ variant, active, disabled, className })}
      aria-label={label}
    >
      {icon}
    </button>
  );
}
