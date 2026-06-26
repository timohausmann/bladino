import { Eye, EyeOff } from 'lucide-react';
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
  placeholder = '',
  type = 'text',
  maxLength,
  disabled = false,
  className = '',
  label,
  required = false,
  hint,
  showPasswordToggle = false,
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
          className="text-foreground mb-1 ml-1 block text-xs tracking-wider uppercase"
        >
          {label}
          {required && <span className="ml-1 text-cyan-500">*</span>}
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
          className={`placeholder:text-muted-foreground w-full rounded-lg border border-black/5 bg-black/10 p-3 pr-12 transition-colors duration-200 outline-none focus:border-black/10 focus:bg-black/15 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/5 dark:bg-black/20 dark:focus:border-cyan-400/50 dark:focus:bg-black/30 ${className} `.trim()}
          aria-label={label || placeholder}
          tabIndex={disabled ? -1 : 0}
        />
        {shouldShowToggle && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 p-1 transition-colors"
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            tabIndex={0}
          >
            {isPasswordVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {hint && (
        <div className="mt-2 ml-1 text-xs text-neutral-500 dark:text-neutral-400">
          {hint}
        </div>
      )}
    </div>
  );
}
