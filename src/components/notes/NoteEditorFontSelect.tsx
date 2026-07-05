import { NOTE_EDITOR_FONT_OPTIONS } from '@/components/notes/noteEditorToolbarConfig';
import type { NoteEditorFontFamily } from '@/components/notes/types';
import { InlineSelect } from '@/components/ui/InlineSelect';
import { useTranslation } from 'react-i18next';

const FONT_FAMILIES = NOTE_EDITOR_FONT_OPTIONS;

interface NoteEditorFontSelectProps {
  value: NoteEditorFontFamily;
  onChange: (value: NoteEditorFontFamily) => void;
}

export function NoteEditorFontSelect({
  value,
  onChange,
}: NoteEditorFontSelectProps) {
  const { t } = useTranslation();

  return (
    <InlineSelect
      value={value}
      onValueChange={onChange}
      ariaLabel={t('notes:fontFamilyLabel')}
      options={FONT_FAMILIES.map((font) => ({
        value: font,
        label: t(`notes:fontFamily${font === 'mono' ? 'Mono' : 'Sans'}`),
      }))}
      triggerClassName="h-10 min-w-28 py-0"
      getItemClassName={(option) =>
        option.value === 'mono' ? 'font-mono' : 'font-sans'
      }
    />
  );
}
