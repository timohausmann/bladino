import {
  NOTE_EDITOR_FONT_OPTIONS,
  NOTE_EDITOR_VIEW_MODE_OPTIONS,
} from '@/components/notes/noteEditorToolbarConfig';
import type {
  NoteEditorFontFamily,
  NoteEditorViewMode,
} from '@/components/notes/types';
import { HeaderButton } from '@/components/ui/HeaderButton';
import { inlineSelectItemClassName } from '@/components/ui/InlineSelect';
import { panelStyles } from '@/components/ui/panel';
import { ContextMenuButton, ContextMenuDivider } from '@/components/ui/popover';
import { Tooltip } from '@/components/ui/Tooltip';
import * as Popover from '@radix-ui/react-popover';
import * as Toolbar from '@radix-ui/react-toolbar';
import clsx from 'clsx';
import { Check, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface NoteEditorToolbarMenuProps {
  fontFamily: NoteEditorFontFamily;
  viewMode: NoteEditorViewMode;
  onFontFamilyChange: (font: NoteEditorFontFamily) => void;
  onViewModeChange: (mode: NoteEditorViewMode) => void;
  onDelete: () => void;
}

interface ToolbarMenuOptionProps {
  label: string;
  selected?: boolean;
  className?: string;
  onClick: () => void;
}

function ToolbarMenuSection({ label }: { label: string }) {
  return (
    <p className="px-3 pt-2 pb-1 text-xs font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
      {label}
    </p>
  );
}

function ToolbarMenuOption({
  label,
  selected = false,
  className,
  onClick,
}: ToolbarMenuOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        inlineSelectItemClassName,
        'w-full cursor-pointer border-none bg-transparent',
        className,
      )}
    >
      <span className="min-w-0 flex-1 text-left">{label}</span>
      {selected ? (
        <Check size={14} className="shrink-0 text-cyan-500" aria-hidden />
      ) : null}
    </button>
  );
}

export function NoteEditorToolbarMenu({
  fontFamily,
  viewMode,
  onFontFamilyChange,
  onViewModeChange,
  onDelete,
}: NoteEditorToolbarMenuProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Tooltip content={t('notes:moreActions')}>
        <Popover.Trigger asChild>
          <Toolbar.Button asChild>
            <HeaderButton
              icon={<MoreHorizontal size={18} />}
              label={t('notes:moreActions')}
              disableTooltip
              aria-expanded={open}
              aria-haspopup="menu"
            />
          </Toolbar.Button>
        </Popover.Trigger>
      </Tooltip>

      <Popover.Portal>
        <Popover.Content
          className={clsx(
            panelStyles.surface,
            panelStyles.dropdownContent,
            'z-50 w-52 p-1',
          )}
          sideOffset={8}
          align="end"
        >
          <ToolbarMenuSection label={t('notes:fontFamilyLabel')} />
          {NOTE_EDITOR_FONT_OPTIONS.map((font) => (
            <ToolbarMenuOption
              key={font}
              label={t(`notes:fontFamily${font === 'mono' ? 'Mono' : 'Sans'}`)}
              selected={fontFamily === font}
              className={font === 'mono' ? 'font-mono' : 'font-sans'}
              onClick={() => {
                onFontFamilyChange(font);
                close();
              }}
            />
          ))}

          <ContextMenuDivider id="view-mode" />
          <ToolbarMenuSection label={t('notes:viewModeLabel')} />
          {NOTE_EDITOR_VIEW_MODE_OPTIONS.map(({ mode, labelKey }) => (
            <ToolbarMenuOption
              key={mode}
              label={t(`notes:${labelKey}`)}
              selected={viewMode === mode}
              onClick={() => {
                onViewModeChange(mode);
                close();
              }}
            />
          ))}

          <ContextMenuDivider id="delete" />
          <ContextMenuButton
            id="delete-note"
            label={t('notes:delete')}
            icon={Trash2}
            variant="destructive"
            onClick={() => {
              close();
              onDelete();
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
