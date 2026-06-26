import React from 'react';

interface PostActionButtonProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  onClick: () => void;
  className?: string;
}

/**
 * PostActionButton - A unified button component for post interactions (reactions, comments, etc.)
 */
export function PostActionButton({
  icon,
  count,
  label,
  onClick,
  className = '',
}: PostActionButtonProps) {
  return (
    <button
      className={`flex cursor-pointer items-center gap-2 rounded-full border-none bg-black/5 px-3 py-2 transition-all duration-200 hover:bg-black/10 hover:shadow-md dark:bg-black/10 dark:hover:bg-black/20 ${className}`}
      title={label}
      aria-label={`${count} ${label}`}
      onClick={onClick}
      tabIndex={0}
    >
      {icon}
      <span className="text-sm font-medium">{count}</span>
    </button>
  );
}
