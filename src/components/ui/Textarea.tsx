import { nanoid } from 'nanoid';
import { twMerge } from 'tailwind-merge';

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
  label?: string;
  required?: boolean;
  resize?: 'resize-none' | 'resize-y' | 'resize-x' | 'resize';
}

export function Textarea({
  value,
  onChange,
  placeholder = '',
  maxLength,
  rows = 3,
  disabled = false,
  className,
  wrapperClassName,
  label,
  required = false,
  resize = 'resize-y',
}: TextareaProps) {
  const textareaId = `textarea-${nanoid()}`;

  return (
    <div className={twMerge('w-full', wrapperClassName)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-foreground mb-2 block text-sm font-medium"
        >
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
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
        className={twMerge(
          'w-full border border-solid border-neutral-200 bg-white/90 p-4 dark:border-neutral-800 dark:bg-black/20',
          'placeholder:text-muted-foreground rounded-lg outline-none',
          'transition-colors duration-200',
          'focus:bg-white dark:focus:bg-black/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          resize,
          className,
        )}
        aria-label={label || placeholder}
        tabIndex={disabled ? -1 : 0}
      />
    </div>
  );
}
