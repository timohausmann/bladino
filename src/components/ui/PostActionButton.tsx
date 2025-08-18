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
export function PostActionButton({ icon, count, label, onClick, className = "" }: PostActionButtonProps) {
    return (
        <button
            className={`flex items-center gap-2 border-none px-3 py-2 rounded-full bg-black/5 transition-all duration-200 dark:bg-black/10 dark:hover:bg-black/20 hover:bg-black/10 hover:shadow-md cursor-pointer ${className}`}
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
