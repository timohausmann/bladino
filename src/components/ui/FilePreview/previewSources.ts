import {
  buildThumbSrcSet,
  canThumbnailImage,
  isDirectPreviewUrl,
  resolveThumbUrl,
  type ThumbWidth,
} from '@/utils/thumbUrl';

/**
 * How FilePreview lays the image out. The sizes strings below must track
 * those class names: a wrong value makes retina screens download the next
 * larger thumb (or a blurry one).
 */
export type PreviewImageLayout = 'hero' | 'pair' | 'tile' | 'compact';

export interface PreviewImageFile {
  filename?: string | null;
  type?: string | null;
  url?: string | null;
}

export interface ThumbnailSources {
  src: string;
  srcSet: string;
  sizes: string;
}

/** Feed column is max-w-2xl; the card adds another 2rem of horizontal padding. */
const POST_COLUMN_CAPPED = '40rem';
/** Narrow viewport: page padding plus card padding, 2rem + 2rem. */
const POST_COLUMN_FLUID = 'calc(100vw - 4rem)';
/** Viewport where max-w-2xl plus the page padding is fully used. */
const COLUMN_CAP_QUERY = '(min-width: 44rem)';
/** `md:` on the tile grid — 3 columns from here, 2 below. */
const THREE_COLUMN_QUERY = '(min-width: 768px)';
/** `gap-3` between tiles. */
const GRID_GAP = '0.75rem';

/**
 * Reply previews sit beside the avatar, the heart, and the menu.
 * 1.5rem avatar + 0.75rem + 0.75rem gaps + 1.125rem heart + 0.25rem + 2rem menu.
 */
const REPLY_CHROME = '6.375rem';
const REPLY_COLUMN_CAPPED = `calc(${POST_COLUMN_CAPPED} - ${REPLY_CHROME})`;
const REPLY_COLUMN_FLUID = `calc(100vw - 4rem - ${REPLY_CHROME})`;

/**
 * `src` for browsers that ignore srcset. Chosen for the usual 1x slot:
 * a full-width post is wider than 512px, a reply tile is not.
 */
const FALLBACK_WIDTH: Record<PreviewImageLayout, ThumbWidth> = {
  hero: 1280,
  pair: 512,
  tile: 512,
  compact: 256,
};

export function getPreviewImageLayout(
  narrow: boolean,
  isImagePost: boolean,
  fileCount: number,
): PreviewImageLayout {
  // Reply tiles are a narrower column than the same grid on the post itself.
  if (narrow) {
    return 'compact';
  }

  if (isImagePost && fileCount === 1) {
    return 'hero';
  }

  if (isImagePost && fileCount === 2) {
    return 'pair';
  }

  return 'tile';
}

/**
 * Thumb sources for a stored image, or undefined when the preview must stay
 * the original (local draft, svg, or a type the thumbnail service rejects).
 */
export function getThumbnailSources(
  file: PreviewImageFile,
  layout: PreviewImageLayout,
): ThumbnailSources | undefined {
  if (file.url && isDirectPreviewUrl(file.url)) {
    return undefined;
  }

  if (!canThumbnailImage(file.filename, file.type)) {
    return undefined;
  }

  return {
    src: resolveThumbUrl(file.filename, FALLBACK_WIDTH[layout]),
    srcSet: buildThumbSrcSet(file.filename),
    sizes: imageSizes(layout),
  };
}

function imageSizes(layout: PreviewImageLayout): string {
  if (layout === 'hero') {
    return columnSizes(POST_COLUMN_CAPPED, POST_COLUMN_FLUID, 'full');
  }

  if (layout === 'pair') {
    return columnSizes(POST_COLUMN_CAPPED, POST_COLUMN_FLUID, 'half');
  }

  if (layout === 'compact') {
    return columnSizes(REPLY_COLUMN_CAPPED, REPLY_COLUMN_FLUID, 'grid');
  }

  return columnSizes(POST_COLUMN_CAPPED, POST_COLUMN_FLUID, 'grid');
}

/** Unwrap `calc(...)` so nested slots stay one calc(). */
function bareLength(value: string): string {
  const wrapped = value.match(/^calc\((.*)\)$/);
  return wrapped ? wrapped[1] : value;
}

function slot(column: string, columns: 1 | 2 | 3): string {
  if (columns === 1) {
    return column;
  }

  const gaps = columns - 1;
  const gap = gaps === 1 ? GRID_GAP : `${GRID_GAP} * ${gaps}`;
  return `calc((${bareLength(column)} - ${gap}) / ${columns})`;
}

/**
 * First matching media condition wins.
 * 3-column tiles only exist from `md` up, which is already past the column cap,
 * so that branch always uses the capped width.
 */
function columnSizes(
  capped: string,
  fluid: string,
  mode: 'full' | 'half' | 'grid',
): string {
  if (mode === 'full') {
    return `${COLUMN_CAP_QUERY} ${capped}, ${fluid}`;
  }

  if (mode === 'half') {
    return `${COLUMN_CAP_QUERY} ${slot(capped, 2)}, ${slot(fluid, 2)}`;
  }

  return [
    `${THREE_COLUMN_QUERY} ${slot(capped, 3)}`,
    `${COLUMN_CAP_QUERY} ${slot(capped, 2)}`,
    slot(fluid, 2),
  ].join(', ');
}
