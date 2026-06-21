import { ConfirmDialog } from '@/components/ui/alert-dialog/ConfirmDialog';
import { ResourceError } from '@/components/ui/ResourceError';
import { ResourceNotFound } from '@/components/ui/ResourceNotFound';
import { Textarea } from '@/components/ui/Textarea';
import { NoteEditorToolbar } from '@/components/notes/NoteEditorToolbar';
import { useNoteEditor } from '@/components/notes/useNoteEditor';

interface NoteEditorProps {
    noteId: string;
    onDeleted?: (deletedId: string) => void;
}

export function NoteEditor({ noteId, onDeleted }: NoteEditorProps) {
    const {
        body,
        saveStatus,
        deleteOpen,
        setDeleteOpen,
        isLoading,
        isError,
        note,
        handleChange,
        handleEmojiSelect,
        handleDelete,
    } = useNoteEditor(noteId, onDeleted);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center text-neutral-500 dark:text-neutral-400 text-sm">
                Loading note…
            </div>
        );
    }

    if (isError) {
        return (
            <ResourceError
                resource="note"
                className="flex-1 flex flex-col items-center justify-center"
            />
        );
    }

    if (!note) {
        return (
            <ResourceNotFound
                resource="note"
                className="flex-1 flex flex-col items-center justify-center"
            />
        );
    }

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <NoteEditorToolbar
                saveStatus={saveStatus}
                onEmojiSelect={handleEmojiSelect}
                onDelete={() => setDeleteOpen(true)}
            />

            <div className="flex-1 min-h-0 p-4 flex flex-col">
                <Textarea
                    value={body}
                    onChange={handleChange}
                    placeholder="Start writing…"
                    resize="resize-none"
                    wrapperClassName="flex-1 min-h-0 flex flex-col"
                    className="flex-1 min-h-0 h-full overflow-y-auto border-none bg-transparent dark:bg-transparent focus:bg-transparent dark:focus:bg-transparent p-0 text-base leading-relaxed rounded-none"
                    rows={1}
                />
            </div>

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete note"
                description="This note will be permanently deleted. This action cannot be undone."
                confirmLabel="Delete"
                destructive
                onConfirm={handleDelete}
            />
        </div>
    );
}
