import {
  CommentSearchDocument,
  requestGraphQL,
  type CommentSearchFilter,
  type CommentSearchQuery,
} from '@/graphql';
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';

/** Cursor value returned by commentSearch; omitted on the first page. */
type CommentSearchPageParam = string | undefined;

/** Paginated search feed. An empty page means there is nothing older. */
export function useCommentSearch(
  filter: CommentSearchFilter,
  options?: { enabled?: boolean },
) {
  return useInfiniteQuery<
    CommentSearchQuery,
    Error,
    InfiniteData<CommentSearchQuery>,
    ['CommentSearch', CommentSearchFilter],
    CommentSearchPageParam
  >({
    queryKey: ['CommentSearch', filter],
    queryFn: ({ pageParam }) =>
      requestGraphQL(CommentSearchDocument, {
        filter,
        cursor: pageParam,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      const feed = lastPage.commentSearch;
      if (!feed?.comments.length) {
        return undefined;
      }

      return feed.cursor;
    },
    enabled: options?.enabled,
  });
}
