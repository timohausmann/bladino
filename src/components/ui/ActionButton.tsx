import { Tooltip } from '@/components/ui/Tooltip';
import React from 'react';

interface ActionButtonProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  onClick: () => void;
  className?: string;
}

/**
 * ActionButton - Icon button with count for compact interactions.
 */
export function ActionButton({
  icon,
  count,
  label,
  onClick,
  className = '',
}: ActionButtonProps) {
  return (
    <Tooltip content={label}>
      <button
        className={`flex cursor-pointer items-center gap-1 rounded-full border-none bg-black/5 px-3 py-2 transition-all duration-200 hover:bg-black/10 hover:shadow-md dark:bg-black/10 dark:hover:bg-black/20 ${className}`}
        aria-label={`${count} ${label}`}
        onClick={onClick}
        tabIndex={0}
      >
        {icon}
        <span className="text-sm font-medium">{count}</span>
      </button>
    </Tooltip>
  );
}
