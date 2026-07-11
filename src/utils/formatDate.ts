import i18n from '@/i18n';
import { normalizeLanguage } from '@/i18n/config';

/** ISO 8601 date string from the GraphQL Date scalar. */
export type ApiDate = string | null | undefined;

function getDateLocale(): string {
  return normalizeLanguage(i18n.language) === 'de' ? 'de-DE' : 'en-US';
}

function parseApiDate(date: ApiDate): Date | null {
  if (!date) {
    return null;
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

/** Formats API date values for display in post headers and comments. */
export function formatCommentDate(date: ApiDate): string {
  const parsed = parseApiDate(date);
  if (!parsed) {
    return '';
  }

  return parsed.toLocaleDateString(getDateLocale(), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Localized timestamp for date tooltips. */
export function formatCommentTimestamp(date: ApiDate): string {
  const parsed = parseApiDate(date);
  if (!parsed) {
    return '';
  }

  return parsed.toLocaleString(getDateLocale(), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Localized relative age for dense post metadata, e.g. "vor 7 Tagen". */
export function formatRelativeCommentDate(date: ApiDate): string {
  const parsed = parseApiDate(date);
  if (!parsed) {
    return '';
  }

  const deltaSeconds = Math.round((parsed.getTime() - Date.now()) / 1000);
  const absoluteSeconds = Math.abs(deltaSeconds);
  const formatter = new Intl.RelativeTimeFormat(getDateLocale(), {
    numeric: 'auto',
  });

  if (absoluteSeconds < 60) {
    return formatter.format(deltaSeconds, 'second');
  }

  if (absoluteSeconds < 60 * 60) {
    return formatter.format(Math.round(deltaSeconds / 60), 'minute');
  }

  if (absoluteSeconds < 60 * 60 * 24) {
    return formatter.format(Math.round(deltaSeconds / (60 * 60)), 'hour');
  }

  if (absoluteSeconds < 60 * 60 * 24 * 30) {
    return formatter.format(Math.round(deltaSeconds / (60 * 60 * 24)), 'day');
  }

  if (absoluteSeconds < 60 * 60 * 24 * 365) {
    return formatter.format(
      Math.round(deltaSeconds / (60 * 60 * 24 * 30)),
      'month',
    );
  }

  return formatter.format(
    Math.round(deltaSeconds / (60 * 60 * 24 * 365)),
    'year',
  );
}

/** Formats a join date for profile pages. */
export function formatJoinDate(date: ApiDate): string {
  const parsed = parseApiDate(date);
  if (!parsed) {
    return '';
  }

  return parsed.toLocaleDateString(getDateLocale(), {
    year: 'numeric',
    month: 'long',
  });
}
