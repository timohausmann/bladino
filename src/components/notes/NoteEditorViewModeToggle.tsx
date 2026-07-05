import { NOTE_EDITOR_VIEW_MODE_OPTIONS } from '@/components/notes/noteEditorToolbarConfig';
import { HeaderButton } from '@/components/ui/HeaderButton';
import { Tooltip } from '@/components/ui/Tooltip';
import type { NoteEditorViewMode } from '@/components/notes/types';
import * as Toolbar from '@radix-ui/react-toolbar';
import { useTranslation } from 'react-i18next';

interface NoteEditorViewModeToggleProps {
  value: NoteEditorViewMode;
  onChange: (mode: NoteEditorViewMode) => void;
}

export function NoteEditorViewModeToggle({
  value,
  onChange,
}: NoteEditorViewModeToggleProps) {
  const { t } = useTranslation();

  return (
    <Toolbar.ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next as NoteEditorViewMode);
      }}
      className="flex h-10 items-center gap-0.5 rounded-lg border border-neutral-200 p-0.5 dark:border-neutral-700"
      aria-label={t('notes:viewModeLabel')}
    >
      {NOTE_EDITOR_VIEW_MODE_OPTIONS.map(({ mode, icon: Icon, labelKey }) => {
        const label = t(`notes:${labelKey}`);

        return (
          <Tooltip key={mode} content={label}>
            <Toolbar.ToggleItem value={mode} asChild>
              <HeaderButton
                icon={<Icon size={16} />}
                label={label}
                shape="soft"
                variant="default"
                active={value === mode}
                disableTooltip
                className="!h-9 !w-9"
              />
            </Toolbar.ToggleItem>
          </Tooltip>
        );
      })}
    </Toolbar.ToggleGroup>
  );
}
