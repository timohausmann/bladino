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
