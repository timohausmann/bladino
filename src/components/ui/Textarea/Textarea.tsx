import { nanoid } from 'nanoid';
import {
  useLayoutEffect,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { twMerge } from 'tailwind-merge';
import { useTextareaPadding } from './useTextareaPadding';

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
  /** Overlay in the top-right; field padding tracks the cluster width. */
  endAdornment?: ReactNode;
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
  autoGrow = false,
  endAdornmentReveal = 'always',
  onFocus,
  onBlur,
}: TextareaProps) {
  const textareaId = id ?? `textarea-${nanoid()}`;
  const [focused, setFocused] = useState(false);

  const hasEndAdornment = endAdornment != null;
  const revealAdornment =
    hasEndAdornment &&
    (endAdornmentReveal === 'always' || focused || value.length > 0);
  const resolvedResize = autoGrow ? 'resize-none' : resize;

  const { textareaRef, adornmentRef, paddingRight } = useTextareaPadding({
    hasAdornment: hasEndAdornment,
    reveal: revealAdornment,
  });

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    if (!autoGrow) {
      el.style.height = '';
      return;
    }

    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value, autoGrow, paddingRight, textareaRef]);

  const handleFocus = () => {
    setFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setFocused(false);
    onBlur?.();
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

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
      <div
        className={twMerge(
          'flex min-h-0 flex-1 flex-col',
          hasEndAdornment && 'relative',
        )}
      >
        <textarea
          ref={textareaRef}
          id={textareaId}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          style={paddingRight != null ? { paddingRight } : undefined}
          className={twMerge(
            'bg-inset block w-full rounded-lg border border-transparent p-4 outline-none',
            'placeholder:text-muted-foreground',
            'transition-[background-color,font-size,line-height,min-height,padding] duration-200 ease-out',
            'disabled:cursor-not-allowed disabled:opacity-50',
            resolvedResize,
            className,
          )}
          aria-label={label || placeholder}
          tabIndex={disabled ? -1 : 0}
        />
        {hasEndAdornment ? (
          <div
            ref={adornmentRef}
            className={twMerge(
              'absolute top-2 right-2 flex items-center gap-0.5 pl-2 transition-opacity duration-200',
              revealAdornment ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            {endAdornment}
          </div>
        ) : null}
      </div>
    </div>
  );
}
