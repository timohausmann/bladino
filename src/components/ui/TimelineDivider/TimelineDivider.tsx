import clsx from 'clsx';

export interface TimelineDividerProps {
  label: string;
  showNewIndicator?: boolean;
  className?: string;
}

/** Centered label that separates sections in a timeline feed. */
export function TimelineDivider({
  label,
  showNewIndicator = false,
  className,
}: TimelineDividerProps) {
  return (
    <div
      role="separator"
      className={clsx('text-muted-foreground text-center text-xs', className)}
    >
      <span className="inline-flex items-center gap-1.5">
        {showNewIndicator && (
          <span
            aria-hidden
            className="bg-primary size-2 shrink-0 rounded-full"
          />
        )}
        {label}
      </span>
    </div>
  );
}
