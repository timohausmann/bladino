import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import {
    DeleteNoteDocument,
    NoteDocument,
    UpdateNoteDocument,
    useGraphQLMutation,
    useGraphQLQuery,
} from '@/graphql';
import { NOTE_SAVE_DEBOUNCE_MS, type NoteSaveStatus } from '@/components/notes/types';
import { toast } from '@/components/ui/toast';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

export function useNoteEditor(
    noteId: string,
    onDeleted?: (deletedId: string) => void,
) {
    const queryClient = useQueryClient();

    const { data, isLoading } = useGraphQLQuery(NoteDocument, { id: noteId });
    const updateNote = useGraphQLMutation(UpdateNoteDocument);
    const deleteNote = useGraphQLMutation(DeleteNoteDocument);

    const [body, setBody] = useState('');
    const [saveStatus, setSaveStatus] = useState<NoteSaveStatus>('idle');
    const [deleteOpen, setDeleteOpen] = useState(false);

    const note = data?.note;

    useEffect(() => {
        if (note) {
            setBody(note.body);
            setSaveStatus('idle');
        }
    }, [note?.id]);

    const persistBody = useCallback(
        async (value: string) => {
            setSaveStatus('saving');
            try {
                await updateNote.mutateAsync({ id: noteId, body: value });
                await queryClient.invalidateQueries({ queryKey: ['Notes'] });
                await queryClient.invalidateQueries({ queryKey: ['Note', { id: noteId }] });
                setSaveStatus('saved');
            } catch {
                setSaveStatus('error');
            }
        },
        [noteId, queryClient, updateNote],
    );

    const debouncedSave = useDebouncedCallback(persistBody, NOTE_SAVE_DEBOUNCE_MS);

    const handleChange = (value: string) => {
        setBody(value);
        setSaveStatus('pending');
        debouncedSave(value);
    };

    const handleEmojiSelect = (emoji: string) => {
        const next =
            !body.length || body.slice(-1) === ' ' ? body + emoji : `${body} ${emoji}`;
        handleChange(next);
    };

    const handleDelete = async () => {
        try {
            await deleteNote.mutateAsync({ id: noteId });
            await queryClient.invalidateQueries({ queryKey: ['Notes'] });
            onDeleted?.(noteId);
            toast('Note deleted');
        } catch {
            setSaveStatus('error');
        }
        setDeleteOpen(false);
    };

    return {
        body,
        saveStatus,
        deleteOpen,
        setDeleteOpen,
        isLoading,
        note,
        handleChange,
        handleEmojiSelect,
        handleDelete,
        isDeleting: deleteNote.isPending,
    };
}
