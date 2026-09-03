import {
  IconButton,
  type IconButtonShape,
  type IconButtonSize,
  type IconButtonVariant,
} from '@/components/ui/IconButton';
import { Tooltip } from '@/components/ui/Tooltip';
import * as Toolbar from '@radix-ui/react-toolbar';
import type { ReactNode } from 'react';

interface ToolbarTooltipButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  tooltip?: string;
  active?: boolean;
  variant?: IconButtonVariant;
  shape?: IconButtonShape;
  size?: IconButtonSize;
  className?: string;
}

/** Toolbar icon button with Radix tooltip (for Toolbar.Button asChild usage). */
export function ToolbarTooltipButton({
  icon,
  label,
  tooltip,
  active = false,
  variant = 'default',
  shape = 'circle',
  size = 'default',
  className,
  disabled = false,
  ...buttonProps
}: ToolbarTooltipButtonProps) {
  return (
    <Tooltip content={tooltip ?? label}>
      <Toolbar.Button asChild>
        <IconButton
          icon={icon}
          label={label}
          active={active}
          variant={variant}
          shape={shape}
          size={size}
          className={className}
          disabled={disabled}
          disableTooltip
          {...buttonProps}
        />
      </Toolbar.Button>
    </Tooltip>
  );
}
