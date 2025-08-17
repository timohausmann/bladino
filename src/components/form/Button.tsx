import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    type?: 'submit' | 'button';
    onClick?: () => void;
}

export function Button({
    children,
    disabled = false,
    loading = false,
    className = "",
    type = "submit",
    onClick
}: ButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`
                px-6 py-2 bg-black/90 dark:bg-white/90 text-white dark:text-black 
                hover:bg-black/95 dark:hover:bg-white/95 disabled:opacity-50 
                cursor-pointer disabled:cursor-not-allowed 
                rounded-full font-medium transition-all
                ${className}
            `.trim()}
            aria-label={typeof children === 'string' ? children : 'Submit'}
            tabIndex={disabled || loading ? -1 : 0}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    Loading...
                </div>
            ) : (
                children
            )}
        </button>
    );
}
