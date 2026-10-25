import {
  SearchFilters,
  type PostSearchFilters,
  type SearchFilterOption,
} from '@/components/search/SearchFilters';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/Card';
import clsx from 'clsx';
import { Search as SearchIcon, X } from 'lucide-react';
import { useEffect, useId, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchMaskProps {
  query: string;
  onQueryChange: (query: string) => void;
  filters: PostSearchFilters;
  onFiltersChange: (patch: Partial<PostSearchFilters>) => void;
  onClearFilters: () => void;
  users: SearchFilterOption[];
  channels: SearchFilterOption[];
  usersLoading?: boolean;
  channelsLoading?: boolean;
}

/**
 * Search field plus post filters. The route owns the URL and the lists.
 */
export function SearchMask({
  query,
  onQueryChange,
  filters,
  onFiltersChange,
  onClearFilters,
  users,
  channels,
  usersLoading,
  channelsLoading,
}: SearchMaskProps) {
  const { t } = useTranslation();
  const queryId = useId();
  const [draft, setDraft] = useState(query);

  useEffect(() => {
    setDraft(query);
  }, [query]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = draft.trim();
    setDraft(nextQuery);
    onQueryChange(nextQuery);
  };

  const handleClearQuery = () => {
    setDraft('');
    if (query) onQueryChange('');
  };

  return (
    <Card className="flex flex-col gap-3">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex items-center gap-2"
      >
        <div className="relative min-w-0 flex-1">
          <label htmlFor={queryId} className="sr-only">
            {t('search:inputLabel')}
          </label>
          <input
            id={queryId}
            type="search"
            name="q"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={t('search:placeholder')}
            enterKeyHint="search"
            autoComplete="off"
            className={clsx([
              'bg-inset w-full rounded-lg border border-transparent py-3 pl-3',
              'text-foreground outline-none',
              'placeholder:text-muted-foreground',
              'focus:bg-inset-deep transition-colors',
              '[&::-webkit-search-cancel-button]:appearance-none',
              '[&::-webkit-search-decoration]:appearance-none',
              draft ? 'pr-12' : 'pr-3',
            ])}
          />
          {draft ? (
            <button
              type="button"
              onClick={handleClearQuery}
              aria-label={t('search:clearQuery')}
              className={clsx([
                'text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1',
                'focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none',
              ])}
            >
              <X size={18} aria-hidden />
            </button>
          ) : null}
        </div>
        <Button
          type="submit"
          aria-label={t('search:submit')}
          iconBefore={<SearchIcon size={18} aria-hidden />}
          className="shrink-0 px-4 sm:px-6"
        >
          <span className="hidden sm:inline">{t('search:submit')}</span>
        </Button>
      </form>
      <SearchFilters
        value={filters}
        onChange={onFiltersChange}
        onClear={onClearFilters}
        users={users}
        channels={channels}
        usersLoading={usersLoading}
        channelsLoading={channelsLoading}
      />
    </Card>
  );
}
