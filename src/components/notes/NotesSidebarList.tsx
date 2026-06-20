import { List, ListItem } from '@/components/ui/list';
import { formatCommentDate } from '@/utils/formatDate';
import { noteTitle } from '@/utils/noteTitle';

interface NotesSidebarListNote {
    id: string;
    body: string;
    dateCreated?: string | null;
    dateEdited?: string | null;
}

interface NotesSidebarListProps {
    notes: NotesSidebarListNote[];
    selectedId: string | null;
    isLoading?: boolean;
    onSelect: (noteId: string) => void;
}

export function NotesSidebarList({
    notes,
    selectedId,
    isLoading = false,
    onSelect,
}: NotesSidebarListProps) {
    if (isLoading) {
        return (
            <div className="p-4 text-sm text-neutral-500 dark:text-neutral-400">
                Loading notes…
            </div>
        );
    }

    return (
        <List label="Notes">
            {notes.map(note => (
                <ListItem
                    key={note.id}
                    title={noteTitle(note.body)}
                    meta={`Edited ${formatCommentDate(note.dateEdited ?? note.dateCreated)}`}
                    active={selectedId === note.id}
                    onClick={() => onSelect(note.id)}
                />
            ))}
        </List>
    );
}
