
import { nanoid } from 'nanoid';

interface TextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    maxLength?: number;
    rows?: number;
    disabled?: boolean;
    className?: string;
    label?: string;
    required?: boolean;
    resize?: 'resize-none' | 'resize-y' | 'resize-x' | 'resize';
}

export function Textarea({
    value,
    onChange,
    placeholder = "",
    maxLength,
    rows = 3,
    disabled = false,
    className = "",
    label,
    required = false,
    resize = "resize-y"
}: TextareaProps) {
    const textareaId = `textarea-${nanoid()}`;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={textareaId}
                    className="block text-sm font-medium text-foreground mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                id={textareaId}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                rows={rows}
                disabled={disabled}
                required={required}
                className={`
                    w-full p-4 bg-white/90 border border-solid border-neutral-200 dark:border-neutral-800 dark:bg-black/20 
                    rounded-lg ${resize} outline-none 
                    placeholder:text-muted-foreground
                    transition-colors duration-200
                    focus:bg-white dark:focus:bg-black/30
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${className}
                `.trim()}
                aria-label={label || placeholder}
                tabIndex={disabled ? -1 : 0}
            />
        </div>
    );
}
