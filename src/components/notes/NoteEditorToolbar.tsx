import { NoteEditorFontSelect } from '@/components/notes/NoteEditorFontSelect';
import { NoteSaveStatusIndicator } from '@/components/notes/NoteSaveStatusIndicator';
import { NoteEditorToolbarMenu } from '@/components/notes/NoteEditorToolbarMenu';
import { NoteEditorViewModeToggle } from '@/components/notes/NoteEditorViewModeToggle';
import { ToolbarTooltipButton } from '@/components/ui/ToolbarTooltipButton';
import {
  NOTE_EDITOR_PADDING_X,
  type NoteEditorFontFamily,
  type NoteEditorViewMode,
  type NoteSaveStatus,
} from '@/components/notes/types';
import * as Toolbar from '@radix-ui/react-toolbar';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface NoteEditorToolbarProps {
  title: string;
  saveStatus: NoteSaveStatus;
  viewMode: NoteEditorViewMode;
  fontFamily: NoteEditorFontFamily;
  onTitleChange: (value: string) => void;
  onViewModeChange: (mode: NoteEditorViewMode) => void;
  onFontFamilyChange: (font: NoteEditorFontFamily) => void;
  onDelete: () => void;
}

export function NoteEditorToolbar({
  title,
  saveStatus,
  viewMode,
  fontFamily,
  onTitleChange,
  onViewModeChange,
  onFontFamilyChange,
  onDelete,
}: NoteEditorToolbarProps) {
  const { t } = useTranslation();

  return (
    <Toolbar.Root
      className={twMerge(
        '@container flex w-full shrink-0 items-center gap-2 border-b border-neutral-200 py-2 dark:border-neutral-800',
        NOTE_EDITOR_PADDING_X,
      )}
      aria-label={t('notes:actions')}
    >
      <div className="flex h-10 min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
        <input
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={t('notes:titlePlaceholder')}
          aria-label={t('notes:titlePlaceholder')}
          className="min-w-0 flex-1 truncate border-none bg-transparent p-0 text-base leading-none font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none @lg:text-lg dark:text-neutral-100 dark:placeholder:text-neutral-500"
        />
        <NoteSaveStatusIndicator status={saveStatus} />
      </div>

      <div className="flex h-10 shrink-0 items-center gap-1">
        <div className="hidden items-center gap-1 @lg:flex">
          <NoteEditorFontSelect
            value={fontFamily}
            onChange={onFontFamilyChange}
          />
          <NoteEditorViewModeToggle
            value={viewMode}
            onChange={onViewModeChange}
          />
          <ToolbarTooltipButton
            icon={<Trash2 size={18} />}
            label={t('notes:delete')}
            variant="dangerous"
            onClick={onDelete}
          />
        </div>

        <div className="shrink-0 @lg:hidden">
          <NoteEditorToolbarMenu
            fontFamily={fontFamily}
            viewMode={viewMode}
            onFontFamilyChange={onFontFamilyChange}
            onViewModeChange={onViewModeChange}
            onDelete={onDelete}
          />
        </div>
      </div>
    </Toolbar.Root>
  );
}
