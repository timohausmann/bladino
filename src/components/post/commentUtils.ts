import type { Comment, File as ApiFile } from '@/graphql';

/** Non-null files from a comment (GraphQL list may contain nulls). */
export function getCommentFiles(comment: Pick<Comment, 'files'>): ApiFile[] {
  return (comment.files ?? []).filter((file): file is ApiFile => file != null);
}

/** DOM id used by reply deep-links and copy-link targets. */
export function getCommentDomId(commentId: string): string {
  return `comment-${commentId}`;
}

/** Non-null child comments from a comment. */
export function getCommentChildren(
  comment: Pick<Comment, 'children'>,
): Comment[] {
  return (comment.children ?? []).filter(
    (child): child is Comment => child != null,
  );
}

/** Thread URL. A reply opens inside its parent, never as its own post. */
export function getCommentDetailLink(comment: {
  id: string;
  parent?: string | null;
}):
  | {
      to: '/post/$id/comment/$commentId';
      params: { id: string; commentId: string };
    }
  | { to: '/post/$id'; params: { id: string } } {
  if (comment.parent) {
    return {
      to: '/post/$id/comment/$commentId',
      params: { id: comment.parent, commentId: comment.id },
    };
  }

  return {
    to: '/post/$id',
    params: { id: comment.id },
  };
}
