import {
  contentPanelHeaderClassName,
  contentPanelTitleInputClassName,
} from '@/components/layout/panelHeader';
import { NoteEditorFontSelect } from '@/components/notes/NoteEditorFontSelect';
import { NoteSaveStatusIndicator } from '@/components/notes/NoteSaveStatusIndicator';
import { NoteEditorToolbarMenu } from '@/components/notes/NoteEditorToolbarMenu';
import { NoteEditorViewModeToggle } from '@/components/notes/NoteEditorViewModeToggle';
import { ToolbarTooltipButton } from '@/components/ui/ToolbarTooltipButton';
import type {
  NoteEditorFontFamily,
  NoteEditorViewMode,
  NoteSaveStatus,
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
      className={twMerge('@container w-full', contentPanelHeaderClassName)}
      aria-label={t('notes:actions')}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
        <input
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={t('notes:titlePlaceholder')}
          aria-label={t('notes:titlePlaceholder')}
          className={contentPanelTitleInputClassName}
        />
        <NoteSaveStatusIndicator status={saveStatus} />
      </div>

      <div className="flex shrink-0 items-center gap-1">
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
