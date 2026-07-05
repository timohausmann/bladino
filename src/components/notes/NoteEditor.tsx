import { ConfirmDialog } from '@/components/ui/alert-dialog/ConfirmDialog';
import { ResourceError } from '@/components/ui/ResourceError';
import { ResourceNotFound } from '@/components/ui/ResourceNotFound';
import { NoteEditorBody } from '@/components/notes/NoteEditorBody';
import { NoteEditorToolbar } from '@/components/notes/NoteEditorToolbar';
import type {
  NoteEditorFontFamily,
  NoteEditorViewMode,
} from '@/components/notes/types';
import { useNoteEditor } from '@/components/notes/useNoteEditor';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface NoteEditorProps {
  noteId: string;
  onDeleted?: (deletedId: string) => void;
}

export function NoteEditor({ noteId, onDeleted }: NoteEditorProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<NoteEditorViewMode>('edit');
  const [fontFamily, setFontFamily] = useState<NoteEditorFontFamily>('mono');
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
        title={title}
        saveStatus={saveStatus}
        viewMode={viewMode}
        fontFamily={fontFamily}
        onTitleChange={handleTitleChange}
        onViewModeChange={setViewMode}
        onFontFamilyChange={setFontFamily}
        onDelete={() => setDeleteOpen(true)}
      />

      <NoteEditorBody
        body={body}
        viewMode={viewMode}
        fontFamily={fontFamily}
        onBodyChange={handleChange}
        onEmojiSelect={handleEmojiSelect}
      />

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
