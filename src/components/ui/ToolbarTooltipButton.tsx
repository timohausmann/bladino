import { HeaderButton } from '@/components/ui/HeaderButton';
import type {
  HeaderButtonShape,
  HeaderButtonVariant,
} from '@/components/ui/headerButtonVariants';
import { Tooltip } from '@/components/ui/Tooltip';
import * as Toolbar from '@radix-ui/react-toolbar';
import type { ReactNode } from 'react';

interface ToolbarTooltipButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  tooltip?: string;
  active?: boolean;
  variant?: HeaderButtonVariant;
  shape?: HeaderButtonShape;
  className?: string;
}

/** Toolbar icon button with Radix tooltip (for Toolbar.Button asChild usage). */
export function ToolbarTooltipButton({
  icon,
  label,
  tooltip,
  active = false,
  variant = 'default',
  shape = 'round',
  className,
  disabled = false,
  ...buttonProps
}: ToolbarTooltipButtonProps) {
  return (
    <Tooltip content={tooltip ?? label}>
      <Toolbar.Button asChild>
        <HeaderButton
          icon={icon}
          label={label}
          active={active}
          variant={variant}
          shape={shape}
          className={className}
          disabled={disabled}
          disableTooltip
          {...buttonProps}
        />
      </Toolbar.Button>
    </Tooltip>
  );
}
