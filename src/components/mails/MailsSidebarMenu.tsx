import { IconButton } from '@/components/ui/IconButton';
import { ContextMenuButton, PopoverContent } from '@/components/ui/popover';
import { Tooltip } from '@/components/ui/Tooltip';
import * as Popover from '@radix-ui/react-popover';
import * as Toolbar from '@radix-ui/react-toolbar';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MailsSidebarMenuProps {
  onDeleteAll: () => void;
  isDeleteAllPending?: boolean;
}

export function MailsSidebarMenu({
  onDeleteAll,
  isDeleteAllPending = false,
}: MailsSidebarMenuProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Tooltip content={t('mail:moreActions')}>
        <Popover.Trigger asChild>
          <Toolbar.Button asChild>
            <IconButton
              icon={<MoreHorizontal size={18} />}
              label={t('mail:moreActions')}
              disableTooltip
              aria-expanded={open}
            />
          </Toolbar.Button>
        </Popover.Trigger>
      </Tooltip>

      <PopoverContent width="w-64">
        <ContextMenuButton
          id="delete-all-mail"
          label={t('mail:deleteAll')}
          icon={Trash2}
          variant="destructive"
          disabled={isDeleteAllPending}
          onClick={() => {
            setOpen(false);
            onDeleteAll();
          }}
        />
      </PopoverContent>
    </Popover.Root>
  );
}
