import { ContentFrame } from '@/components/layout/ContentFrame';
import { MobileBackLink } from '@/components/layout/MobileBackLink';
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
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDesktopLayout } from '@/hooks/useDesktopLayout';

/**
 * Notes page with context panel list and main editor area.
 */
export function Notes() {
  const { t } = useTranslation();
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isDesktopLayout = useDesktopLayout();

  const { data, isLoading } = useGraphQLQuery(NotesDocument);
  const addNote = useGraphQLMutation(AddNoteDocument);

  const notes = useMemo(() => data?.notes ?? [], [data?.notes]);
  const selectedId = id ?? null;
  const isEmpty = !isLoading && notes.length === 0;

  useEffect(() => {
    if (isDesktopLayout && !id && notes.length > 0) {
      navigate({
        to: '/notes/$id',
        params: { id: notes[0].id },
        replace: true,
      });
    }
  }, [id, isDesktopLayout, notes, navigate]);

  const handleSelect = (noteId: string) => {
    navigate({ to: '/notes/$id', params: { id: noteId } });
  };

  const handleCreate = async () => {
    try {
      const result = await addNote.mutateAsync({});
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
    <ContentFrame
      mobilePane={selectedId || isEmpty ? 'content' : 'sidebar'}
      sidebar={
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
        <NoteEditor
          noteId={selectedId}
          onDeleted={handleNoteDeleted}
          toolbarLeading={
            <MobileBackLink to="/notes" label={t('common:back')} />
          }
        />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          {isEmpty ? (
            <div className="lg:hidden">
              <NotesSidebarToolbar
                onCreate={handleCreate}
                isCreating={addNote.isPending}
              />
            </div>
          ) : null}
          <NotesEmptyState />
        </div>
      )}
    </ContentFrame>
  );
}
