import clsx from 'clsx';

interface NavigationCountBadgeProps {
  count?: number;
  className?: string;
}

const formatCount = (count: number): string =>
  count > 99 ? '99+' : String(count);

/** Compact counter shared by navigation rows in both rail layouts. */
export function NavigationCountBadge({
  count = 0,
  className,
}: NavigationCountBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <span
      className={clsx(
        'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-0.5',
        'bg-cyan-300 text-[10px] font-medium text-black tabular-nums text-shadow-2xs',
        className,
      )}
    >
      {formatCount(count)}
    </span>
  );
}
