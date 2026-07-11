export type NoteSaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

export type NoteEditorViewMode = 'edit' | 'preview' | 'split';

/** Editor body font — system stacks only, no webfont loading. */
export type NoteEditorFontFamily = 'mono' | 'sans';

export const NOTE_EDITOR_FONT_CLASS: Record<NoteEditorFontFamily, string> = {
  mono: 'font-mono',
  sans: 'font-sans',
};

export const NOTE_SAVE_DEBOUNCE_MS = 400;

/** Shared horizontal padding for note editor body (aligned with content headers). */
export const NOTE_EDITOR_PADDING_X = 'px-2 md:px-6';
