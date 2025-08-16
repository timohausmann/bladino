
import { nanoid } from 'nanoid';

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
    required = false
}: InputProps) {
    const inputId = `input-${nanoid()}`;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-foreground ml-1 mb-1"
                >
                    {label}
                    {required && <span className="text-cyan-500 ml-1">*</span>}
                </label>
            )}
            <input
                id={inputId}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                disabled={disabled}
                required={required}
                className={`
                    w-full p-3 bg-black/10 dark:bg-black/20 
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
        </div>
    );
}
