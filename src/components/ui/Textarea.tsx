import { nanoid } from 'nanoid';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import {
  getTextareaEndInsetClassName,
  type TextareaEndInsetCounts,
} from '@/utils/textareaEndInset';
import { twMerge } from 'tailwind-merge';

interface TextareaProps {
  id?: string;
  name?: string;
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
  autoComplete?: string;
  /** Rendered inside the field at the top-right (e.g. emoji picker). */
  endAdornment?: ReactNode;
  /** Visible w-10 adornment slots; derives right padding automatically. */
  endAdornmentSlotCounts?: TextareaEndInsetCounts;
  /** Manual override when endAdornmentSlotCounts is not set. Defaults to pr-12. */
  endAdornmentInsetClassName?: string;
  /** Grows height with content from a single-line minimum. */
  autoGrow?: boolean;
  /** When to show endAdornment. */
  endAdornmentReveal?: 'always' | 'focus-or-filled';
  onFocus?: () => void;
  onBlur?: () => void;
}

export function Textarea({
  id,
  name,
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
  autoComplete,
  endAdornment,
  endAdornmentSlotCounts,
  endAdornmentInsetClassName = 'pr-12',
  autoGrow = false,
  endAdornmentReveal = 'always',
  onFocus,
  onBlur,
}: TextareaProps) {
  const textareaId = id ?? `textarea-${nanoid()}`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    if (!autoGrow) {
      el.style.height = '';
      return;
    }

    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value, autoGrow]);

  const resolvedResize = autoGrow ? 'resize-none' : resize;
  const isFilled = value.length > 0;
  const revealAdornment =
    endAdornment != null &&
    (endAdornmentReveal === 'always' || focused || isFilled);

  const resolvedEndInset =
    revealAdornment && endAdornment
      ? endAdornmentSlotCounts != null
        ? getTextareaEndInsetClassName(endAdornmentSlotCounts)
        : endAdornmentInsetClassName
      : undefined;

  return (
    <div
      className={twMerge(
        'w-full',
        endAdornment && 'relative',
        wrapperClassName,
      )}
    >
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
        ref={textareaRef}
        id={textareaId}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          setFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        className={twMerge(
          'bg-inset block w-full rounded-lg border border-transparent p-4 outline-none',
          'placeholder:text-muted-foreground',
          'transition-[background-color,font-size,line-height,min-height,padding] duration-200 ease-out',
          'disabled:cursor-not-allowed disabled:opacity-50',
          resolvedEndInset,
          resolvedResize,
          className,
        )}
        aria-label={label || placeholder}
        tabIndex={disabled ? -1 : 0}
      />
      {endAdornment ? (
        <div
          className={twMerge(
            'absolute top-2 right-2 flex items-center gap-0.5 transition-opacity duration-200',
            revealAdornment ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          {endAdornment}
        </div>
      ) : null}
    </div>
  );
}
