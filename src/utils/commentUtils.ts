import type { Comment, File as ApiFile } from '@/graphql';

/** Non-null files from a comment (GraphQL list may contain nulls). */
export function getCommentFiles(comment: Pick<Comment, 'files'>): ApiFile[] {
  return (comment.files ?? []).filter((file): file is ApiFile => file != null);
}

/** Non-null child comments from a comment. */
export function getCommentChildren(
  comment: Pick<Comment, 'children'>,
): Comment[] {
  return (comment.children ?? []).filter(
    (child): child is Comment => child != null,
  );
}
