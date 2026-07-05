import { ConfirmDialog } from '@/components/ui/alert-dialog/ConfirmDialog';
import { ResourceError } from '@/components/ui/ResourceError';
import { ResourceNotFound } from '@/components/ui/ResourceNotFound';
import { Textarea } from '@/components/ui/Textarea';
import { NoteEditorToolbar } from '@/components/notes/NoteEditorToolbar';
import { useNoteEditor } from '@/components/notes/useNoteEditor';
import { useTranslation } from 'react-i18next';

interface NoteEditorProps {
  noteId: string;
  onDeleted?: (deletedId: string) => void;
}

export function NoteEditor({ noteId, onDeleted }: NoteEditorProps) {
  const { t } = useTranslation();
  const {
    title,
    body,
    saveStatus,
    deleteOpen,
    setDeleteOpen,
    isLoading,
    isError,
    note,
    handleTitleChange,
    handleChange,
    handleEmojiSelect,
    handleDelete,
  } = useNoteEditor(noteId, onDeleted);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
        {t('notes:loading')}
      </div>
    );
  }

  if (isError) {
    return (
      <ResourceError
        resource="note"
        className="flex flex-1 flex-col items-center justify-center"
      />
    );
  }

  if (!note) {
    return (
      <ResourceNotFound
        resource="note"
        className="flex flex-1 flex-col items-center justify-center"
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <NoteEditorToolbar
        saveStatus={saveStatus}
        onEmojiSelect={handleEmojiSelect}
        onDelete={() => setDeleteOpen(true)}
      />

      <div className="flex min-h-0 flex-1 flex-col p-4">
        <input
          type="text"
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          placeholder={t('notes:titlePlaceholder')}
          aria-label={t('notes:titlePlaceholder')}
          className="mb-3 w-full border-none bg-transparent p-0 text-xl font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500"
        />
        <Textarea
          value={body}
          onChange={handleChange}
          placeholder={t('notes:editorPlaceholder')}
          resize="resize-none"
          wrapperClassName="flex-1 min-h-0 flex flex-col"
          className="h-full min-h-0 flex-1 overflow-y-auto rounded-none border-none bg-transparent p-0 text-base leading-relaxed focus:bg-transparent dark:bg-transparent dark:focus:bg-transparent"
          rows={1}
        />
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('notes:deleteTitle')}
        description={t('notes:deleteDescription')}
        confirmLabel={t('common:delete')}
        cancelLabel={t('common:cancel')}
        destructive
        onConfirm={handleDelete}
      />
    </div>
  );
}
