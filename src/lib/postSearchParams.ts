/** Rolling window. `custom` keeps the explicit `from` / `to` dates. */
export type PostSearchRange = '30d' | '6m' | '12m' | 'custom';

export interface PostSearch {
  q?: string;
  user?: string;
  /** Preset stands in for the two date fields. Absent means all time. */
  range?: PostSearchRange;
  from?: string;
  to?: string;
  channel?: string;
  type?: 'post' | 'reply';
  liked?: boolean;
}

const DATE_PARAM = /^\d{4}-\d{2}-\d{2}$/;

function readString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

function readDate(value: unknown): string | undefined {
  const date = readString(value);
  if (!date || !DATE_PARAM.test(date)) return undefined;

  const [year, month, day] = date.split('-').map(Number);
  // Date overflows an impossible day into the next month.
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return undefined;
  }

  return date;
}

/** Keeps `/search` query params to the filters the page actually renders. */
export function validatePostSearch(
  search: Record<string, unknown>,
): PostSearch {
  const type =
    search.type === 'post' || search.type === 'reply' ? search.type : undefined;

  const range =
    search.range === '30d' ||
    search.range === '6m' ||
    search.range === '12m' ||
    search.range === 'custom'
      ? search.range
      : undefined;
  const preset = range === '30d' || range === '6m' || range === '12m';

  return {
    q: readString(search.q),
    user: readString(search.user),
    range,
    from: preset ? undefined : readDate(search.from),
    to: preset ? undefined : readDate(search.to),
    channel: readString(search.channel),
    type,
    liked: search.liked === true || search.liked === 'true' ? true : undefined,
  };
}
