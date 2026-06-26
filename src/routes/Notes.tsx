import { ContextPanel } from '@/components/layout/ContextPanel';
import {
  getNextNoteIdAfterDelete,
  NoteEditor,
  NotesEmptyState,
  NotesSidebarList,
  NotesSidebarToolbar,
} from '@/components/notes';
import {
  AddNoteDocument,
  NotesDocument,
  useGraphQLMutation,
  useGraphQLQuery,
} from '@/graphql';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';

/**
 * Notes page with context panel list and main editor area.
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
    <div className="flex h-full min-h-0 flex-1">
      <ContextPanel
        header={
          <NotesSidebarToolbar
            onCreate={handleCreate}
            isCreating={addNote.isPending}
          />
        }
      >
        <NotesSidebarList
          notes={notes}
          selectedId={selectedId}
          isLoading={isLoading}
          onSelect={handleSelect}
        />
      </ContextPanel>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {selectedId ? (
          <NoteEditor noteId={selectedId} onDeleted={handleNoteDeleted} />
        ) : (
          <NotesEmptyState />
        )}
      </div>
    </div>
  );
}
