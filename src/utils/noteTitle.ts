import i18n from '@/i18n';

interface NoteTitleSource {
  title?: string | null;
  body?: string | null;
}

/** Note title for list display: explicit title, else first line of body, else untitled. */
export function noteTitle(note: NoteTitleSource): string {
  const trimmedTitle = note.title?.trim();
  if (trimmedTitle) return trimmedTitle;

  const firstLine = note.body?.split('\n')[0]?.trim();
  return firstLine || i18n.t('notes:untitled');
}
