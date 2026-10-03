/**
 * Image thumbs from dashnet-server `GET /thumb/:size/:filename`.
 * Widths and extensions must stay in sync with `ALLOWED_SIZES` / `ALLOWED_EXTENSIONS`
 * in dashnet-server/src/thumb.js — anything else 400s.
 * The service resizes by width only and keeps the source aspect ratio.
 */

const THUMB_BASE_PATH = import.meta.env.VITE_THUMB_URL ?? '/thumb';

/**
 * Widths we offer in srcset. The service also accepts 1920, but the feed
 * column is at most ~640px, so 1280 already covers 2×. We do not advertise
 * 1920, otherwise a 3× display would generate that file on first view.
 */
export const THUMB_WIDTHS = [128, 256, 512, 1280] as const;

export type ThumbWidth = (typeof THUMB_WIDTHS)[number];

const THUMB_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.avif',
  '.heic',
  '.heif',
]);

/**
 * Server uploads are a single filename. Blob/data previews and remote URLs
 * are not stored under that name, so they cannot be thumbnailed.
 */
export function isDirectPreviewUrl(url: string): boolean {
  return (
    url.startsWith('blob:') ||
    url.startsWith('data:') ||
    url.startsWith('http://') ||
    url.startsWith('https://')
  );
}

export function canThumbnailImage(
  filename?: string | null,
  type?: string | null,
): filename is string {
  if (!type?.startsWith('image/')) {
    return false;
  }

  if (!filename || filename !== filename.split(/[/\\]/).pop()) {
    return false;
  }

  const dot = filename.lastIndexOf('.');
  if (dot <= 0) {
    return false;
  }

  return THUMB_EXTENSIONS.has(filename.slice(dot).toLowerCase());
}

export function resolveThumbUrl(filename: string, width: ThumbWidth): string {
  const base = THUMB_BASE_PATH.replace(/\/$/, '');
  return `${base}/${width}/${encodeURIComponent(filename)}`;
}

/** One candidate per offered width. The browser downloads a single match. */
export function buildThumbSrcSet(filename: string): string {
  return THUMB_WIDTHS.map(
    (width) => `${resolveThumbUrl(filename, width)} ${width}w`,
  ).join(', ');
}
