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
  variant?: 'default' | 'ghost';
  /** When to show endAdornment. Ghost composers use focus-or-filled. */
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
  variant = 'default',
  endAdornmentReveal = 'always',
  onFocus,
  onBlur,
}: TextareaProps) {
  const textareaId = id ?? `textarea-${nanoid()}`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

  useLayoutEffect(() => {
    if (!autoGrow) return;

    const el = textareaRef.current;
    if (!el) return;

    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value, autoGrow]);

  const resolvedResize = autoGrow ? 'resize-none' : resize;
  const isFilled = value.length > 0;
  const isGhost = variant === 'ghost';
  const isGhostActive = isGhost && (focused || isFilled);
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
          'block w-full rounded-lg outline-none',
          'placeholder:text-muted-foreground',
          'transition-[background-color,border-color,padding] duration-200',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isGhost
            ? twMerge(
                'border border-transparent bg-transparent px-0 py-2',
                'dark:border-transparent dark:bg-transparent',
                isGhostActive &&
                  'border-neutral-200 bg-white/90 px-3 dark:border-neutral-800 dark:bg-black/20',
                isGhostActive && 'focus:bg-white dark:focus:bg-black/30',
              )
            : twMerge(
                'border border-solid border-neutral-200 bg-white/90 p-4 dark:border-neutral-800 dark:bg-black/20',
                'focus:bg-white dark:focus:bg-black/30',
              ),
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
