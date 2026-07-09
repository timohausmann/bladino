import i18n from '@/i18n';
import { normalizeLanguage } from '@/i18n/config';

/** ISO 8601 date string from the GraphQL Date scalar. */
export type ApiDate = string | null | undefined;

function getDateLocale(): string {
  return normalizeLanguage(i18n.language) === 'de' ? 'de-DE' : 'en-US';
}

/** Formats API date values for display in post headers and comments. */
export function formatCommentDate(date: ApiDate): string {
  if (!date) {
    return '';
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toLocaleDateString(getDateLocale(), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Compact relative age for dense post headers, e.g. "45 min ago". */
export function formatRelativeCommentDate(date: ApiDate): string {
  if (!date) {
    return '';
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  const elapsedMs = Date.now() - parsed.getTime();
  const elapsedSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const language = normalizeLanguage(i18n.language);
  const suffix = language === 'de' ? 'her' : 'ago';

  if (elapsedSeconds < 60) {
    return language === 'de' ? 'gerade eben' : 'just now';
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} min ${suffix}`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return `${elapsedHours} h ${suffix}`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);
  if (elapsedDays < 30) {
    return `${elapsedDays} d ${suffix}`;
  }

  return formatCommentDate(date);
}

/** Formats a join date for profile pages. */
export function formatJoinDate(date: ApiDate): string {
  if (!date) {
    return '';
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toLocaleDateString(getDateLocale(), {
    year: 'numeric',
    month: 'long',
  });
}
