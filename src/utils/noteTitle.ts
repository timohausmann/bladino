import i18n from '@/i18n';

/** First line of note body, used as list title. */
export function noteTitle(body: string): string {
  const firstLine = body.split('\n')[0]?.trim();
  return firstLine || i18n.t('notes:untitled');
}
