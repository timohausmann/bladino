import * as Select from '@radix-ui/react-select';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export interface InlineSelectOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
}

export interface InlineSelectProps<T extends string = string> {
  value?: T;
  onValueChange: (value: T) => void;
  options: InlineSelectOption<T>[];
  ariaLabel: string;
  placeholder?: string;
  disabled?: boolean;
  triggerClassName?: string;
  valueClassName?: string;
  getItemClassName?: (
    option: InlineSelectOption<T>,
    isSelected: boolean,
  ) => string | undefined;
  showSelectedIndicator?: boolean;
}

export const inlineSelectTriggerBaseClassName =
  'inline-flex w-auto min-w-20 shrink-0 items-center justify-between gap-2 rounded-lg border-none px-2 py-1.5 text-sm transition-colors outline-none';

export const inlineSelectTriggerClassName = clsx(
  inlineSelectTriggerBaseClassName,
  'bg-transparent hover:bg-white/10',
  'disabled:cursor-not-allowed disabled:opacity-60',
  '[&_[data-placeholder]]:text-muted-foreground [&_[data-placeholder]]:font-normal',
);

export const inlineSelectTriggerReadOnlyClassName = clsx(
  inlineSelectTriggerBaseClassName,
  'cursor-default bg-transparent font-medium',
);

export const inlineSelectContentClassName =
  'z-50 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800';

export const inlineSelectItemClassName =
  'flex cursor-pointer items-center justify-between gap-2 rounded px-3 py-2 text-sm text-neutral-900 outline-none select-none hover:bg-neutral-100 data-[highlighted]:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-700 dark:data-[highlighted]:bg-neutral-700';

/**
 * Compact inline Radix select shared across toolbars and composers.
 */
export function InlineSelect<T extends string = string>({
  value,
  onValueChange,
  options,
  ariaLabel,
  placeholder,
  disabled,
  triggerClassName,
  valueClassName,
  getItemClassName,
  showSelectedIndicator = true,
}: InlineSelectProps<T>) {
  return (
    <Select.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <Select.Trigger
        className={twMerge(inlineSelectTriggerClassName, triggerClassName)}
        aria-label={ariaLabel}
      >
        <Select.Value
          placeholder={placeholder}
          className={twMerge('min-w-0 flex-1 truncate', valueClassName)}
        />
        <Select.Icon className="shrink-0">
          <ChevronDown size={14} className="text-neutral-500" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={inlineSelectContentClassName}>
          <Select.Viewport className="p-1">
            {options.map((option) => {
              const isSelected = value === option.value;

              return (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className={inlineSelectItemClassName}
                >
                  <Select.ItemText
                    className={twMerge(
                      'min-w-0 truncate',
                      getItemClassName?.(option, isSelected),
                    )}
                  >
                    {option.label}
                  </Select.ItemText>
                  {showSelectedIndicator && isSelected ? (
                    <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                  ) : null}
                </Select.Item>
              );
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
