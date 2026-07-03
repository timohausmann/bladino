import type { MailFolder } from '@/components/mails/types';
import { MAIL_FOLDERS } from '@/components/mails/types';
import { HeaderButton } from '@/components/ui/HeaderButton';
import { InlineSelect } from '@/components/ui/InlineSelect';
import * as Toolbar from '@radix-ui/react-toolbar';
import clsx from 'clsx';
import { Plus, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Toolbar.Root
      className="flex shrink-0 items-center gap-1 border-b border-neutral-200 p-2 dark:border-neutral-800"
      aria-label={t('mail:listActions')}
    >
      <Toolbar.Button asChild>
        <HeaderButton
          icon={<Plus size={18} />}
          label={t('mail:newMail')}
          variant="persistent"
          onClick={onCompose}
          disabled={isSending}
        />
      </Toolbar.Button>
      <InlineSelect
        value={folder}
        onValueChange={onFolderChange}
        options={MAIL_FOLDERS.map((option) => ({
          value: option,
          label: t(`mail:folders.${option}`),
        }))}
        ariaLabel={t('mail:folderLabel')}
      />
      <div className="ml-auto">
        <Toolbar.Button asChild>
          <HeaderButton
            icon={
              <RefreshCw
                size={18}
                className={clsx(isReloading && 'animate-spin')}
              />
            }
            label={t('mail:reload')}
            variant="default"
            onClick={onReload}
            disabled={isReloading}
          />
        </Toolbar.Button>
      </div>
    </Toolbar.Root>
  );
}
