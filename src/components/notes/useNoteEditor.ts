import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import {
  DeleteNoteDocument,
  NoteDocument,
  UpdateNoteDocument,
  useGraphQLMutation,
  useGraphQLQuery,
} from '@/graphql';
import {
  NOTE_SAVE_DEBOUNCE_MS,
  type NoteSaveStatus,
} from '@/components/notes/types';
import { toast } from '@/components/ui/toast';
import i18n from '@/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

interface NoteDraft {
  title: string;
  body: string;
}

export function useNoteEditor(
  noteId: string,
  onDeleted?: (deletedId: string) => void,
) {
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useGraphQLQuery(NoteDocument, {
    id: noteId,
  });
  const updateNote = useGraphQLMutation(UpdateNoteDocument);
  const deleteNote = useGraphQLMutation(DeleteNoteDocument);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saveStatus, setSaveStatus] = useState<NoteSaveStatus>('idle');
  const [deleteOpen, setDeleteOpen] = useState(false);

  const note = data?.note;

  useEffect(() => {
    if (note) {
      setTitle(note.title ?? '');
      setBody(note.body);
      setSaveStatus('idle');
    }
  }, [note?.id]);

  const persistNote = useCallback(
    async ({ title: nextTitle, body: nextBody }: NoteDraft) => {
      setSaveStatus('saving');
      try {
        await updateNote.mutateAsync({
          id: noteId,
          title: nextTitle,
          body: nextBody,
        });
        await queryClient.invalidateQueries({ queryKey: ['Notes'] });
        await queryClient.invalidateQueries({
          queryKey: ['Note', { id: noteId }],
        });
        setSaveStatus('saved');
      } catch {
        setSaveStatus('error');
      }
    },
    [noteId, queryClient, updateNote],
  );

  const debouncedSave = useDebouncedCallback(
    persistNote,
    NOTE_SAVE_DEBOUNCE_MS,
  );

  const queueSave = (draft: NoteDraft) => {
    setSaveStatus('pending');
    debouncedSave(draft);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    queueSave({ title: value, body });
  };

  const handleChange = (value: string) => {
    setBody(value);
    queueSave({ title, body: value });
  };

  const handleEmojiSelect = (emoji: string) => {
    const next =
      !body.length || body.slice(-1) === ' '
        ? body + emoji
        : `${body} ${emoji}`;
    handleChange(next);
  };

  const handleDelete = async () => {
    try {
      await deleteNote.mutateAsync({ id: noteId });
      await queryClient.invalidateQueries({ queryKey: ['Notes'] });
      onDeleted?.(noteId);
      toast(i18n.t('notes:deletedToast'));
    } catch {
      setSaveStatus('error');
    }
    setDeleteOpen(false);
  };

  return {
    title,
    body,
    saveStatus,
    deleteOpen,
    setDeleteOpen,
    isLoading: isPending,
    isError,
    note,
    handleTitleChange,
    handleChange,
    handleEmojiSelect,
    handleDelete,
    isDeleting: deleteNote.isPending,
  };
}
