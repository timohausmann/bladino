import clsx from 'clsx';
import type { Weblink } from '@/graphql';
import { parseCommentBody } from '@/utils/textUtils';
import { useMemo } from 'react';

interface CommentBodyProps {
  body?: string | null;
  weblinks?: Array<Weblink | null> | null;
  className?: string;
}

/**
 * Renders comment text with weblink aliases replaced by inline LinkPreview cards.
 * Plain text segments preserve line breaks as <br /> elements.
 */
export function CommentBody({ body, weblinks, className }: CommentBodyProps) {
  const content = useMemo(
    () => (body ? parseCommentBody(body, weblinks) : null),
    [body, weblinks],
  );

  if (!body) {
    return null;
  }

  return (
    <div className={clsx('flex flex-col gap-3', className)}>{content}</div>
  );
}
