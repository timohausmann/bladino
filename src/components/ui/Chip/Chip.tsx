import clsx from 'clsx';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  leading?: ReactNode;
  onRemove: () => void;
  removeLabel: string;
  /** Inset is recessed. Elevated sits on the card; light mode draws an outline because the fill matches the card. */
  surface?: 'inset' | 'elevated';
}

export function Chip({
  children,
  leading,
  onRemove,
  removeLabel,
  surface = 'inset',
}: ChipProps) {
  return (
    <span
      className={clsx([
        'inline-flex max-w-full items-center gap-1 rounded-full',
        'text-foreground py-1 pr-1 text-sm',
        // Outline stays out of the box, so a chip does not grow the row. Dark elevated is already lighter than the card.
        surface === 'elevated'
          ? 'bg-elevated outline-elevated-border outline dark:outline-none'
          : 'bg-inset',
        leading ? 'pl-1' : 'pl-3',
      ])}
    >
      {leading ? <span className="mr-1 shrink-0">{leading}</span> : null}
      <span className="min-w-0 truncate">{children}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className={clsx([
          'text-muted-foreground hover:text-foreground -my-px shrink-0 rounded-full p-1',
          'focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none',
        ])}
      >
        <X size={14} aria-hidden />
      </button>
    </span>
  );
}
