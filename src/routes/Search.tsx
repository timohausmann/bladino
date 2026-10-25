import { FeedStreamHeader } from '@/components/feed';
import { SearchMask } from '@/components/search/SearchMask';
import { ResourceError } from '@/components/ui/ResourceError';
import {
  ChannelsDocument,
  UserDirectoryDocument,
  getGraphQLErrorMessage,
  useGraphQLQuery,
} from '@/graphql';
import type { PostSearch } from '@/lib/postSearchParams';
import { useNavigate, useSearch } from '@tanstack/react-router';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface SearchResultsProps {
  query?: string;
}

function SearchResults({ query }: SearchResultsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1 py-12 text-center">
      <p className="text-foreground text-sm font-medium">
        {query ? t('search:queryTitle', { query }) : t('search:emptyTitle')}
      </p>
      <p className="text-muted-foreground text-sm">{t('search:pending')}</p>
    </div>
  );
}

/**
 * Post search. Filters are real URL state; the result list is not wired up yet.
 *
 * Stacked at the feed width until 67rem. Then the mask grows up to that
 * width, and the results column takes the rest with a centered feed inside.
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
              <SearchResults query={params.q} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
