/** Next note in list after delete (below, else above). Null when list will be empty. */
export function getNextNoteIdAfterDelete(
    notes: { id: string }[],
    deletedId: string,
): string | null {
    const index = notes.findIndex((note) => note.id === deletedId);
    if (index === -1) {
        return notes[0]?.id ?? null;
    }

    const next = notes[index + 1] ?? notes[index - 1];
    return next?.id ?? null;
}
