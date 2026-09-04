import clsx from 'clsx';

interface NavigationCountBadgeProps {
  count?: number;
  className?: string;
  /** Compact sits on a collapsed icon; default matches expanded nav rows. */
  size?: 'default' | 'compact';
}

const formatCount = (count: number): string =>
  count > 99 ? '99+' : String(count);

const sizeClassName = {
  default: 'h-5 min-w-5 px-1.5 text-xs',
  compact: 'h-4 min-w-4 px-1 text-[10px]',
} as const;

/** Unread counter shared by navigation rows in both rail layouts. */
export function NavigationCountBadge({
  count = 0,
  className,
  size = 'default',
}: NavigationCountBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-full',
        'bg-cyan-300 font-medium text-black tabular-nums text-shadow-2xs',
        sizeClassName[size],
        className,
      )}
    >
      {formatCount(count)}
    </span>
  );
}
