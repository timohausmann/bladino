import { panelStyles } from '@/components/ui/panel';
import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface SettingsSelectOption<T extends string> {
  value: T;
  label: string;
}

interface SettingsSelectFieldProps<T extends string> {
  label: string;
  value: T;
  onValueChange: (value: T) => void;
  placeholder: string;
  options: SettingsSelectOption<T>[];
}

/**
 * Styled select field used across settings panels.
 */
export function SettingsSelectField<T extends string>({
  label,
  value,
  onValueChange,
  placeholder,
  options,
}: SettingsSelectFieldProps<T>) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {label}
      </label>
      <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger className="flex w-full items-center justify-between rounded-lg border-none bg-black/10 p-3 transition-colors outline-none hover:bg-black/15 dark:bg-black/20 dark:hover:bg-black/30">
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className={twMerge(panelStyles.surface, panelStyles.selectContent)}
          >
            <Select.Viewport className="p-1">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex cursor-pointer items-center rounded px-3 py-2 text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-700"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  {value === option.value && (
                    <div className="absolute right-2 h-2 w-2 rounded-full bg-cyan-500" />
                  )}
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
