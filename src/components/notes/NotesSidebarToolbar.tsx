import { ToolbarTooltipButton } from '@/components/ui/ToolbarTooltipButton';
import * as Toolbar from '@radix-ui/react-toolbar';
import { ArrowDownAZ, Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NotesSidebarToolbarProps {
  onCreate: () => void;
  isCreating?: boolean;
}

export function NotesSidebarToolbar({
  onCreate,
  isCreating = false,
}: NotesSidebarToolbarProps) {
  const { t } = useTranslation();

  return (
    <Toolbar.Root
      className="flex shrink-0 items-center gap-1 border-b border-neutral-200 p-2 dark:border-neutral-800"
      aria-label={t('notes:listActions')}
    >
      <ToolbarTooltipButton
        icon={<Plus size={18} />}
        label={t('notes:newNote')}
        variant="persistent"
        onClick={onCreate}
        disabled={isCreating}
      />
      <div className="ml-auto flex items-center gap-1">
        <ToolbarTooltipButton
          icon={<Search size={18} />}
          label={t('notes:search')}
          variant="default"
          disabled
        />
        <ToolbarTooltipButton
          icon={<ArrowDownAZ size={18} />}
          label={t('notes:sort')}
          variant="default"
          disabled
        />
      </div>
    </Toolbar.Root>
  );
}
