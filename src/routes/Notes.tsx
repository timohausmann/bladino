import { SidebarLayout } from '@/components/layout/SidebarLayout';
import {
    getNextNoteIdAfterDelete,
    NoteEditor,
    NotesEmptyState,
    NotesSidebarList,
    NotesSidebarToolbar,
} from '@/components/notes';
import { AddNoteDocument, NotesDocument, useGraphQLMutation, useGraphQLQuery } from '@/graphql';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';

/**
 * Notes page with sidebar list and main editor area.
 */
export function Notes() {
    const { id } = useParams({ strict: false });
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading } = useGraphQLQuery(NotesDocument);
    const addNote = useGraphQLMutation(AddNoteDocument);

    const notes = data?.notes ?? [];
    const selectedId = id ?? null;

    useEffect(() => {
        if (!id && notes.length > 0) {
            navigate({
                to: '/notes/$id',
                params: { id: notes[0].id },
                replace: true,
            });
        }
    }, [id, notes, navigate]);

    const handleSelect = (noteId: string) => {
        navigate({ to: '/notes/$id', params: { id: noteId } });
    };

    const handleCreate = async () => {
        try {
            const result = await addNote.mutateAsync({ body: '' });
            await queryClient.invalidateQueries({ queryKey: ['Notes'] });
            if (result.addNote) {
                navigate({ to: '/notes/$id', params: { id: result.addNote.id } });
            }
        } catch {
            // Creation failed — list stays as-is
        }
    };

    const handleNoteDeleted = (deletedId: string) => {
        const nextId = getNextNoteIdAfterDelete(notes, deletedId);
        if (nextId) {
            navigate({
                to: '/notes/$id',
                params: { id: nextId },
            });
        } else {
            navigate({ to: '/notes' });
        }
    };

    return (
        <div
            className="flex-1 flex flex-col min-h-0 max-w-5xl mx-auto w-full h-full border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white/80 dark:bg-neutral-900/50 shadow-sm"
        >
            <SidebarLayout className="flex-1 min-h-0 h-full" sidebar={
                <>
                    <NotesSidebarToolbar
                        onCreate={handleCreate}
                        isCreating={addNote.isPending}
                    />
                    <NotesSidebarList
                        notes={notes}
                        selectedId={selectedId}
                        isLoading={isLoading}
                        onSelect={handleSelect}
                    />
                </>
            }
        >
            {selectedId ? (
                <NoteEditor noteId={selectedId} onDeleted={handleNoteDeleted} />
            ) : (
                <NotesEmptyState />
            )}
        </SidebarLayout>
        </div>
    );
}
