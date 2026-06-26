import clsx from 'clsx';
import type { Weblink } from '@/graphql';
import type { LinkPreviewVariant } from '@/components/ui/LinkPreview';
import { parseCommentBody } from '@/utils/textUtils';
import { useMemo } from 'react';

interface CommentBodyProps {
  body?: string | null;
  weblinks?: Array<Weblink | null> | null;
  className?: string;
  linkPreviewVariant?: LinkPreviewVariant;
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
}: CommentBodyProps) {
  const content = useMemo(
    () =>
      body ? parseCommentBody(body, weblinks, linkPreviewVariant) : null,
    [body, weblinks, linkPreviewVariant],
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
