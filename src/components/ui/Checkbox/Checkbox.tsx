import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { Check } from 'lucide-react';

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

/**
 * Inset checkbox. The check stays mounted so it can ease in and out.
 */
export function Checkbox({
  id,
  checked,
  disabled,
  onCheckedChange,
  className,
}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={checked}
      disabled={disabled}
      onCheckedChange={(value) => onCheckedChange?.(value === true)}
      className={clsx(
        'border-inset-border bg-inset inline-flex size-4.5 shrink-0 items-center justify-center rounded-md border',
        'cursor-pointer transition-colors',
        'hover:bg-inset-deep',
        'focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none',
        'disabled:hover:bg-inset disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      <CheckboxPrimitive.Indicator
        forceMount
        className={clsx(
          'text-foreground flex items-center justify-center',
          // scale-* sets the scale property, so the check eases on that rather than transform.
          'transition-[opacity,scale] duration-200 ease-out',
          'data-[state=checked]:scale-100 data-[state=checked]:opacity-100',
          'data-[state=unchecked]:scale-75 data-[state=unchecked]:opacity-0',
        )}
      >
        <Check size={12} strokeWidth={3} aria-hidden />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
