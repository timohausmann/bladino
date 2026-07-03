import { CreateAddEmoji } from '@/components/create/CreateAddEmoji';
import { HeaderButton } from '@/components/ui/HeaderButton';
import type { NoteSaveStatus } from '@/components/notes/types';
import { NoteSaveStatusLabel } from '@/components/notes/NoteSaveStatusLabel';
import * as Toolbar from '@radix-ui/react-toolbar';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NoteEditorToolbarProps {
  saveStatus: NoteSaveStatus;
  onEmojiSelect: (emoji: string) => void;
  onDelete: () => void;
}

export function NoteEditorToolbar({
  saveStatus,
  onEmojiSelect,
  onDelete,
}: NoteEditorToolbarProps) {
  const { t } = useTranslation();

  return (
    <Toolbar.Root
      className="flex shrink-0 items-center gap-4 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800"
      aria-label={t('notes:actions')}
    >
      <div className="flex items-center gap-2">
        <CreateAddEmoji onEmojiSelect={onEmojiSelect} />
        <NoteSaveStatusLabel status={saveStatus} />
      </div>
      <Toolbar.Button asChild className="ml-auto">
        <HeaderButton
          icon={<Trash2 size={18} />}
          label={t('notes:delete')}
          variant="dangerous"
          onClick={onDelete}
        />
      </Toolbar.Button>
    </Toolbar.Root>
  );
}
