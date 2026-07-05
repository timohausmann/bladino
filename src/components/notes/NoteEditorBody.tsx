import { CreateAddEmoji } from '@/components/create/CreateAddEmoji';
import { NoteMarkdownPreview } from '@/components/notes/NoteMarkdownPreview';
import {
  NOTE_EDITOR_FONT_CLASS,
  NOTE_EDITOR_PADDING_X,
  type NoteEditorFontFamily,
  type NoteEditorViewMode,
} from '@/components/notes/types';
import { Textarea } from '@/components/ui/Textarea';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface NoteEditorBodyProps {
  body: string;
  viewMode: NoteEditorViewMode;
  fontFamily: NoteEditorFontFamily;
  onBodyChange: (value: string) => void;
  onEmojiSelect: (emoji: string) => void;
}

const editorTextareaBaseClassName =
  'min-h-[82px] flex-1 overflow-y-auto py-3 text-sm leading-normal';

export function NoteEditorBody({
  body,
  viewMode,
  fontFamily,
  onBodyChange,
  onEmojiSelect,
}: NoteEditorBodyProps) {
  const { t } = useTranslation();

  const editor = (
    <Textarea
      value={body}
      onChange={onBodyChange}
      placeholder={t('notes:editorPlaceholder')}
      resize="resize-none"
      variant="default"
      endAdornmentReveal="always"
      wrapperClassName="flex h-full min-h-0 flex-1 flex-col"
      className={twMerge(
        editorTextareaBaseClassName,
        NOTE_EDITOR_FONT_CLASS[fontFamily],
      )}
      endAdornment={
        <CreateAddEmoji onEmojiSelect={onEmojiSelect} shape="soft" />
      }
      rows={1}
    />
  );

  const preview = (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <NoteMarkdownPreview body={body} />
    </div>
  );

  return (
    <div
      className={twMerge(
        'flex min-h-0 flex-1 flex-col py-4',
        NOTE_EDITOR_PADDING_X,
      )}
    >
      {viewMode === 'edit' && (
        <div className="flex min-h-0 flex-1 flex-col">{editor}</div>
      )}

      {viewMode === 'preview' && preview}

      {viewMode === 'split' && (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex min-h-0 min-w-0 flex-col border-b border-neutral-200 pb-4 lg:border-r lg:border-b-0 lg:pr-4 lg:pb-0 dark:border-neutral-800">
            {editor}
          </div>
          <div className="flex min-h-0 min-w-0 flex-col">{preview}</div>
        </div>
      )}
    </div>
  );
}
