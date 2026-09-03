import clsx from 'clsx';
import type { Weblink } from '@/graphql';
import type { LinkPreviewVariant } from '@/components/ui/LinkPreview';
import type { ParentSurface } from '@/components/ui/surface';
import { parseCommentBody } from '@/utils/textUtils';
import { useMemo } from 'react';

interface CommentBodyProps {
  body?: string | null;
  weblinks?: Array<Weblink | null> | null;
  className?: string;
  linkPreviewVariant?: LinkPreviewVariant;
  parentSurface?: ParentSurface;
}

/**
 * Renders comment text with weblink aliases replaced by inline LinkPreview cards.
 * Plain text segments preserve line breaks as <br /> elements.
 */
export function CommentBody({
  body,
  weblinks,
  className,
  linkPreviewVariant = 'default',
  parentSurface = 'surface',
}: CommentBodyProps) {
  const content = useMemo(
    () =>
      body
        ? parseCommentBody(body, weblinks, linkPreviewVariant, parentSurface)
        : null,
    [body, weblinks, linkPreviewVariant, parentSurface],
  );

  if (!body) {
    return null;
  }

  return (
    <div
      className={clsx(
        'flex flex-col',
        linkPreviewVariant === 'compact' ? 'gap-2' : 'gap-3',
        className,
      )}
    >
      {content}
    </div>
  );
}
