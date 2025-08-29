
import { Eye, EyeOff } from "lucide-react";
import { nanoid } from 'nanoid';
import { ReactNode, useState } from 'react';

interface InputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'url' | 'search';
    maxLength?: number;
    disabled?: boolean;
    className?: string;
    label?: string;
    required?: boolean;
    hint?: string | ReactNode;
    showPasswordToggle?: boolean;
}

export function Input({
    value,
    onChange,
    placeholder = "",
    type = "text",
    maxLength,
    disabled = false,
    className = "",
    label,
    required = false,
    hint,
    showPasswordToggle = false
}: InputProps) {
    const inputId = `input-${nanoid()}`;
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Determine the actual input type (text or password)
    const actualType = type === 'password' && isPasswordVisible ? 'text' : type;

    // Only show toggle for password inputs when enabled
    const shouldShowToggle = type === 'password' && showPasswordToggle;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-xs text-foreground uppercase tracking-wider ml-1 mb-1"
                >
                    {label}
                    {required && <span className="text-cyan-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    id={inputId}
                    type={actualType}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    disabled={disabled}
                    required={required}
                    className={`
                        w-full p-3 pr-12 bg-black/10 dark:bg-black/20 
                        border-none rounded-lg outline-none 
                        placeholder:text-muted-foreground
                        transition-colors duration-200
                        focus:bg-black/15 dark:focus:bg-black/30
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${className}
                    `.trim()}
                    aria-label={label || placeholder}
                    tabIndex={disabled ? -1 : 0}
                />
                {shouldShowToggle && (
                    <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                        tabIndex={0}
                    >
                        {isPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
            {hint && (
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 ml-1">
                    {hint}
                </div>
            )}
        </div>
    );
}
