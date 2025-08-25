import { Post, PostComment } from "@/types";

export function isPostComment(post: Post | PostComment): post is PostComment {
  return "parentPostId" in post;
}
