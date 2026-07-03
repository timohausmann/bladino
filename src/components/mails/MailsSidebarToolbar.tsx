import type { MailFolder } from '@/components/mails/types';
import { MAIL_FOLDERS } from '@/components/mails/types';
import { HeaderButton } from '@/components/ui/HeaderButton';
import * as Select from '@radix-ui/react-select';
import * as Toolbar from '@radix-ui/react-toolbar';
import clsx from 'clsx';
import { ChevronDown, Plus, RefreshCw } from 'lucide-react';

interface MailsSidebarToolbarProps {
  onCompose: () => void;
  folder: MailFolder;
  onFolderChange: (folder: MailFolder) => void;
  onReload: () => void;
  isReloading?: boolean;
  isSending?: boolean;
}

export function MailsSidebarToolbar({
  onCompose,
  folder,
  onFolderChange,
  onReload,
  isReloading = false,
  isSending = false,
}: MailsSidebarToolbarProps) {
  return (
    <Toolbar.Root
      className="flex shrink-0 items-center gap-1 border-b border-neutral-200 p-2 dark:border-neutral-800"
      aria-label="Mails list actions"
    >
      <Toolbar.Button asChild>
        <HeaderButton
          icon={<Plus size={18} />}
          label="New mail"
          variant="persistent"
          onClick={onCompose}
          disabled={isSending}
        />
      </Toolbar.Button>
      <Select.Root value={folder} onValueChange={onFolderChange}>
        <Select.Trigger
          className="flex w-auto shrink-0 items-center justify-between gap-1 rounded-lg bg-neutral-100 px-2 py-1.5 text-sm font-medium text-neutral-900 transition-colors outline-none hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
          aria-label="Mail folder"
        >
          <Select.Value />
          <Select.Icon>
            <ChevronDown size={14} className="shrink-0 text-neutral-500" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="z-50 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
            <Select.Viewport className="p-1">
              {MAIL_FOLDERS.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer rounded-md px-3 py-2 text-sm text-neutral-900 outline-none select-none data-[highlighted]:bg-neutral-100 dark:text-neutral-100 dark:data-[highlighted]:bg-neutral-800"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <div className="ml-auto">
        <Toolbar.Button asChild>
          <HeaderButton
            icon={
              <RefreshCw
                size={18}
                className={clsx(isReloading && 'animate-spin')}
              />
            }
            label="Reload mails"
            variant="default"
            onClick={onReload}
            disabled={isReloading}
          />
        </Toolbar.Button>
      </div>
    </Toolbar.Root>
  );
}
