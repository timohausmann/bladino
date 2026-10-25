import { FeedStreamHeader } from '@/components/feed';
import { PostCard } from '@/components/post';
import { SearchMask } from '@/components/search/SearchMask';
import { useCommentSearch } from '@/components/search/useCommentSearch';
import { Banner } from '@/components/ui/Banner';
import { ResourceError } from '@/components/ui/ResourceError';
import {
  ChannelsDocument,
  UserDirectoryDocument,
  getGraphQLErrorMessage,
  useGraphQLQuery,
  type Comment,
  type CommentSearchQuery,
} from '@/graphql';
import {
  hasCommentSearchCriteria,
  isCommentSearchRangeInvalid,
  toCommentSearchFilter,
} from '@/lib/commentSearchFilter';
import type { PostSearch } from '@/lib/postSearchParams';
import { useNavigate, useSearch } from '@tanstack/react-router';
import clsx from 'clsx';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

type SearchComment = NonNullable<
  NonNullable<CommentSearchQuery['commentSearch']>['comments'][number]
>;

interface SearchIdleProps {
  query?: string;
}

function SearchIdle({ query }: SearchIdleProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1 py-12 text-center">
      <p className="text-foreground text-sm font-medium">
        {query ? t('search:queryTitle', { query }) : t('search:emptyTitle')}
      </p>
      <p className="text-muted-foreground text-sm">{t('search:idle')}</p>
    </div>
  );
}

interface SearchResultsProps {
  search: PostSearch;
}

function SearchResults({ search }: SearchResultsProps) {
  const { t } = useTranslation();
  const { q, user, channel, range, from, to, type } = search;
  const criteria = useMemo(
    () => ({ q, user, channel, range, from, to, type }),
    [q, user, channel, range, from, to, type],
  );
  const filter = useMemo(() => toCommentSearchFilter(criteria), [criteria]);
  const hasCriteria = hasCommentSearchCriteria(criteria);
  const rangeInvalid = isCommentSearchRangeInvalid(criteria);
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommentSearch(filter, { enabled: hasCriteria && !rangeInvalid });
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const comments = useMemo(
    () =>
      (data?.pages ?? []).flatMap((page) =>
        (page.commentSearch?.comments ?? []).filter(
          (comment): comment is SearchComment => comment != null,
        ),
      ),
    [data],
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (!hasCriteria) {
    return <SearchIdle query={q} />;
  }

  // The form already explains an inverted custom range.
  if (rangeInvalid) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      {isLoading && (
        <p className="text-muted-foreground py-8 text-center">
          {t('posts:loadingFeed')}
        </p>
      )}

      {isError && (
        <Banner
          message={t('errors:feedLoadFailed')}
          variant="negative"
          className="mx-auto max-w-lg"
        />
      )}

      {!isLoading && !isError && comments.length === 0 && (
        <p className="text-muted-foreground py-8 text-center">
          {t('search:noResults')}
        </p>
      )}

      {comments.map((comment) => (
        <PostCard key={comment.id} comment={comment as Comment} />
      ))}

      {hasNextPage && <div ref={loadMoreRef} aria-hidden className="h-1" />}

      {isFetchingNextPage && (
        <p className="text-muted-foreground py-4 text-center">
          {t('posts:loadingMore')}
        </p>
      )}
    </div>
  );
}

/**
 * Post search. Filters are URL state. Results page like the comment feed.
 *
 * Stacked at the feed width until 67rem. Then the mask grows up to that
 * width and sticks in the existing page scroll, while the results column
 * takes the rest with a centered feed inside.
 */
export function Search() {
  const { t } = useTranslation();
  const params = useSearch({ from: '/_authenticated/search' });
  const navigate = useNavigate();
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
    error: usersQueryError,
  } = useGraphQLQuery(UserDirectoryDocument);
  const {
    data: channelsData,
    isLoading: channelsLoading,
    isError: channelsError,
    error: channelsQueryError,
  } = useGraphQLQuery(ChannelsDocument);

  const updateSearch = (patch: Partial<PostSearch>) => {
    navigate({
      to: '/search',
      search: { ...params, ...patch },
      replace: true,
    });
  };

  return (
    <div className="@container w-full">
      <div
        className={clsx(
          'mx-auto flex w-full max-w-2xl flex-col gap-4',
          '@min-[67rem]:max-w-none',
        )}
      >
        <FeedStreamHeader>{t('search:title')}</FeedStreamHeader>

        <div
          className={clsx(
            'flex flex-col gap-4',
            '@min-[67rem]:flex-row @min-[67rem]:items-start',
          )}
        >
          <div
            className={clsx(
              'flex w-full flex-col gap-4',
              '@min-[67rem]:sticky @min-[67rem]:top-0',
              '@min-[67rem]:w-auto @min-[67rem]:max-w-2xl @min-[67rem]:min-w-96 @min-[67rem]:flex-1',
            )}
          >
            <SearchMask
              query={params.q ?? ''}
              onQueryChange={(query) => updateSearch({ q: query || undefined })}
              filters={params}
              onFiltersChange={updateSearch}
              onClearFilters={() =>
                navigate({
                  to: '/search',
                  search: { q: params.q },
                  replace: true,
                })
              }
              users={usersData?.users ?? []}
              channels={channelsData?.channels ?? []}
              usersLoading={usersLoading || usersError}
              channelsLoading={channelsLoading || channelsError}
            />

            {usersError ? (
              <ResourceError
                resource="user"
                message={getGraphQLErrorMessage(usersQueryError)}
              />
            ) : null}
            {channelsError ? (
              <ResourceError
                resource="channel"
                message={getGraphQLErrorMessage(channelsQueryError)}
              />
            ) : null}
          </div>

          <div className="flex min-w-0 flex-1 justify-center">
            <div className="w-full max-w-2xl">
              <SearchResults search={params} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
