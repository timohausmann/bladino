import type { PostSearch, PostSearchRange } from './postSearchParams';

/** Fields the search API accepts. */
export interface CommentSearchFilter {
  q?: string;
  user?: string;
  channel?: string;
  range?: Exclude<PostSearchRange, 'custom'>;
  /** Inclusive start of the custom range, local midnight as an ISO instant. */
  from?: string;
  /** Exclusive end of the custom range, local midnight of the next day. */
  to?: string;
  type?: 'post' | 'reply';
  attachment?: boolean;
  link?: boolean;
}

function startOfLocalDay(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toISOString();
}

function startOfNextLocalDay(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day + 1).toISOString();
}

/** Maps shareable URL state onto the commentSearch input. */
export function toCommentSearchFilter(search: PostSearch): CommentSearchFilter {
  const filter: CommentSearchFilter = {};

  if (search.q) filter.q = search.q;
  if (search.user) filter.user = search.user;
  if (search.channel) filter.channel = search.channel;
  if (search.type) filter.type = search.type;
  if (search.attachment) filter.attachment = true;
  if (search.link) filter.link = true;

  if (
    search.range === '30d' ||
    search.range === '6m' ||
    search.range === '12m'
  ) {
    filter.range = search.range;
    return filter;
  }

  if (search.from) filter.from = startOfLocalDay(search.from);
  if (search.to) filter.to = startOfNextLocalDay(search.to);
  return filter;
}

/** True when the URL has a criterion the API applies. */
export function hasCommentSearchCriteria(search: PostSearch): boolean {
  return Object.keys(toCommentSearchFilter(search)).length > 0;
}

/** Custom range whose start day is after its end day. */
export function isCommentSearchRangeInvalid(search: PostSearch): boolean {
  if (!search.from || !search.to) return false;
  return search.from > search.to;
}
