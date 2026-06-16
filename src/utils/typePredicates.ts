import type { Comment } from "@/graphql";

export function isReplyComment(comment: Comment): boolean {
  return comment.parent != null;
}
