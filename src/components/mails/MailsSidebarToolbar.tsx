import { panelSidebarHeaderClassName } from '@/components/layout/panelHeader';
import type { MailFolder } from '@/components/mails/types';
import { MAIL_FOLDERS } from '@/components/mails/types';
import { InlineSelect } from '@/components/ui/InlineSelect';
import { ToolbarTooltipButton } from '@/components/ui/ToolbarTooltipButton';
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
      className={panelSidebarHeaderClassName}
      aria-label={t('mail:listActions')}
    >
      <ToolbarTooltipButton
        icon={<Plus size={16} />}
        label={t('mail:newMail')}
        variant="persistent"
        size="sm"
        onClick={onCompose}
        disabled={isSending}
      />
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
        <ToolbarTooltipButton
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
      </div>
    </Toolbar.Root>
  );
}
