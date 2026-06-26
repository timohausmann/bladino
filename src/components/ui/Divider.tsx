import clsx from 'clsx';

interface DividerProps {
  className?: string;
}

/**
 * Horizontal rule.
 */
export function Divider({ className }: DividerProps) {
  return (
    <div
      role="separator"
      className={clsx('h-px bg-gray-200 dark:bg-white/14', className)}
    />
  );
}
