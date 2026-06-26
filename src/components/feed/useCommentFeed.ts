import {
  CommentFeedDocument,
  requestGraphQL,
  type CommentFeedQuery,
  type CommentFilter,
} from '@/graphql';
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';

/** Cursor value returned by commentFeed; omitted on the first page. */
type CommentFeedPageParam = string | undefined;

/** Paginated comment feed backed by the commentFeed GraphQL query. */
export function useCommentFeed(
  filter: CommentFilter,
  options?: { enabled?: boolean },
) {
  return useInfiniteQuery<
    CommentFeedQuery,
    Error,
    InfiniteData<CommentFeedQuery>,
    ['CommentFeed', CommentFilter],
    CommentFeedPageParam
  >({
    queryKey: ['CommentFeed', filter],
    queryFn: ({ pageParam }) =>
      requestGraphQL(CommentFeedDocument, {
        filter,
        cursor: pageParam,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      const feed = lastPage.commentFeed;
      if (!feed?.comments.length) {
        return undefined;
      }

      return feed.cursor;
    },
    enabled: options?.enabled,
  });
}
