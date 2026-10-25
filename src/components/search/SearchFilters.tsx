import { Chip } from '@/components/ui/Chip';
import { Divider } from '@/components/ui/Divider';
import { Avatar } from '@/components/ui/Avatar';
import {
  InlineSelect,
  type InlineSelectOption,
} from '@/components/ui/InlineSelect';
import type { PostSearch } from '@/lib/postSearchParams';
import { normalizeLanguage } from '@/i18n';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as Switch from '@radix-ui/react-switch';
import clsx from 'clsx';
import { ChevronUp, SlidersHorizontal } from 'lucide-react';
import {
  useMemo,
  useRef,
  useState,
  useId,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';

/** Sentinel so Radix Select can represent “no filter”. Never written to the URL. */
const ANY_VALUE = '__any__';

export type PostSearchFilters = Omit<PostSearch, 'q'>;

export interface SearchFilterOption {
  id: string;
  name: string;
  avatar?: string | null;
}

interface SearchFiltersProps {
  value: PostSearchFilters;
  onChange: (patch: Partial<PostSearchFilters>) => void;
  onClear: () => void;
  users: SearchFilterOption[];
  channels: SearchFilterOption[];
  usersLoading?: boolean;
  channelsLoading?: boolean;
}

interface FilterLabelProps {
  children: ReactNode;
  htmlFor?: string;
}

interface FilterFieldProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}

interface FilterSelectProps {
  label: string;
  value?: string;
  options: InlineSelectOption[];
  disabled?: boolean;
  onValueChange: (value: string | undefined) => void;
}

interface ActiveFilterChip {
  key: string;
  label: string;
  leading?: ReactNode;
  onRemove: () => void;
}

const filterLabelClassName = 'text-muted-foreground shrink-0 text-sm';

const fieldFrameClassName = clsx([
  'w-full max-w-64 rounded-lg px-3 py-2 text-sm transition-colors',
  'focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none',
]);

const fieldInputClassName = clsx([
  fieldFrameClassName,
  'bg-inset hover:bg-inset-deep',
  'text-foreground outline-none',
  'scheme-light dark:scheme-dark',
  'aria-invalid:ring-2 aria-invalid:ring-inset aria-invalid:ring-rose-500/60',
]);

const filterSelectClassName = clsx([fieldFrameClassName, 'shrink font-normal']);

function formatFilterDate(value: string, locale: string): string {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return value;

  // Date-only params are calendar days, not UTC instants.
  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function FilterLabel({ children, htmlFor }: FilterLabelProps) {
  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={filterLabelClassName}>
        {children}
      </label>
    );
  }

  return (
    <p aria-hidden className={filterLabelClassName}>
      {children}
    </p>
  );
}

/** Label and control are cells of the parent grid, so the labels share one column. */
function FilterField({ label, htmlFor, children }: FilterFieldProps) {
  return (
    <>
      <FilterLabel htmlFor={htmlFor}>{label}</FilterLabel>
      <div className="flex min-h-10 w-full max-w-64 min-w-0 items-center justify-self-start">
        {children}
      </div>
    </>
  );
}

function FilterSelect({
  label,
  value,
  options,
  disabled,
  onValueChange,
}: FilterSelectProps) {
  const selected = options.some((option) => option.value === value)
    ? value
    : ANY_VALUE;

  return (
    <FilterField label={label}>
      <InlineSelect
        value={selected}
        onValueChange={(next) =>
          onValueChange(next === ANY_VALUE ? undefined : next)
        }
        options={options}
        ariaLabel={label}
        disabled={disabled}
        surface="inset"
        triggerClassName={filterSelectClassName}
        valueClassName={
          selected === ANY_VALUE
            ? 'font-normal text-muted-foreground'
            : 'text-foreground'
        }
      />
    </FilterField>
  );
}

function UserFilterLabel({ name, avatar }: SearchFilterOption) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <Avatar avatar={avatar} alt="" className="size-5 shrink-0" />
      <span className="truncate">{name}</span>
    </span>
  );
}

function toSelectOptions(
  entries: SearchFilterOption[],
  anyLabel: string,
  formatLabel: (entry: SearchFilterOption) => ReactNode,
  selectedId: string | undefined,
  language: string,
): InlineSelectOption[] {
  const options = [...entries]
    .sort((a, b) => a.name.localeCompare(b.name, language))
    .map((entry) => ({
      value: entry.id,
      label: formatLabel(entry),
    }));

  if (selectedId && !options.some((option) => option.value === selectedId)) {
    options.push({ value: selectedId, label: selectedId });
  }

  return [{ value: ANY_VALUE, label: anyLabel }, ...options];
}

/**
 * Expandable post filters. The parent owns the values and the option lists.
 */
export function SearchFilters({
  value,
  onChange,
  onClear,
  users,
  channels,
  usersLoading = false,
  channelsLoading = false,
}: SearchFiltersProps) {
  const { t, i18n } = useTranslation();
  const fieldId = useId();
  const fromId = `${fieldId}-from`;
  const toId = `${fieldId}-to`;
  const rangeErrorId = `${fieldId}-range`;
  const likedId = `${fieldId}-liked`;
  const hasFilters = Boolean(
    value.user ||
      value.range ||
      value.from ||
      value.to ||
      value.channel ||
      value.type ||
      value.liked,
  );
  const [open, setOpen] = useState(hasFilters);
  const locale = normalizeLanguage(i18n.language) === 'de' ? 'de-DE' : 'en-US';
  const rangeInvalid = Boolean(value.from && value.to && value.from > value.to);
  const liked = value.liked === true;

  const userOptions = useMemo(
    () =>
      toSelectOptions(
        users,
        t('search:any'),
        (user) => <UserFilterLabel {...user} />,
        value.user,
        i18n.language,
      ),
    [i18n.language, t, users, value.user],
  );
  const channelOptions = useMemo(
    () =>
      toSelectOptions(
        channels,
        t('search:any'),
        (channel) => `#${channel.name}`,
        value.channel,
        i18n.language,
      ),
    [channels, i18n.language, t, value.channel],
  );
  const typeOptions = useMemo(
    () => [
      { value: ANY_VALUE, label: t('search:any') },
      { value: 'post', label: t('search:typePost') },
      { value: 'reply', label: t('search:typeReply') },
    ],
    [t],
  );
  const periodOptions = useMemo(
    () => [
      { value: ANY_VALUE, label: t('search:allTime') },
      { value: '30d', label: t('search:last30Days') },
      { value: '6m', label: t('search:last6Months') },
      { value: '12m', label: t('search:last12Months') },
      { value: 'custom', label: t('search:customRange') },
    ],
    [t],
  );
  const periodPreset =
    value.range === '30d' || value.range === '6m' || value.range === '12m'
      ? value.range
      : undefined;
  const periodValue = periodPreset
    ? periodPreset
    : value.range === 'custom' || value.from || value.to
      ? 'custom'
      : undefined;

  const selectedUser = users.find((user) => user.id === value.user);
  const channelName = channels.find(
    (channel) => channel.id === value.channel,
  )?.name;
  const customPeriodLabel =
    value.from && value.to
      ? `${formatFilterDate(value.from, locale)} – ${formatFilterDate(value.to, locale)}`
      : value.from
        ? `${t('search:from')} ${formatFilterDate(value.from, locale)}`
        : value.to
          ? `${t('search:to')} ${formatFilterDate(value.to, locale)}`
          : undefined;
  const presetLabel = {
    '30d': t('search:last30Days'),
    '6m': t('search:last6Months'),
    '12m': t('search:last12Months'),
  } as const;
  const periodLabel = periodPreset
    ? presetLabel[periodPreset]
    : customPeriodLabel;

  const chips = (
    [
      value.user
        ? {
            key: 'user',
            label: selectedUser?.name ?? value.user,
            leading: selectedUser ? (
              <Avatar avatar={selectedUser.avatar} alt="" className="size-5" />
            ) : undefined,
            onRemove: () => onChange({ user: undefined }),
          }
        : undefined,
      periodLabel
        ? {
            key: 'period',
            label: periodLabel,
            onRemove: () =>
              onChange({ range: undefined, from: undefined, to: undefined }),
          }
        : undefined,
      value.channel
        ? {
            key: 'channel',
            label: channelName ? `#${channelName}` : value.channel,
            onRemove: () => onChange({ channel: undefined }),
          }
        : undefined,
      value.type
        ? {
            key: 'type',
            label:
              value.type === 'post'
                ? t('search:typePost')
                : t('search:typeReply'),
            onRemove: () => onChange({ type: undefined }),
          }
        : undefined,
      liked
        ? {
            key: 'liked',
            label: t('search:likedByMe'),
            onRemove: () => onChange({ liked: undefined }),
          }
        : undefined,
    ] satisfies Array<ActiveFilterChip | undefined>
  ).filter((chip) => chip != null);
  // Newest filter sits next to the add chip. The ref keeps the older order.
  const chipOrder = useRef(chips.map((chip) => chip.key));
  const activeKeys = chips.map((chip) => chip.key);
  const kept = chipOrder.current.filter((key) => activeKeys.includes(key));
  const added = activeKeys.filter((key) => !kept.includes(key));
  chipOrder.current = [...added, ...kept];
  const orderedChips = chipOrder.current.flatMap((key) => {
    const chip = chips.find((item) => item.key === key);
    return chip ? [chip] : [];
  });

  const handleFromChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ from: event.target.value || undefined });
  };

  const handleToChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ to: event.target.value || undefined });
  };

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Collapsible.Trigger
          className={clsx([
            'inline-flex shrink-0 items-center gap-1.5 rounded-full py-1 pr-3 pl-2 text-sm',
            'text-foreground outline-elevated-border outline dark:outline-none',
            'focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none',
            open ? 'bg-elevated-hover' : 'bg-elevated hover:bg-elevated-hover',
          ])}
        >
          {open ? (
            <ChevronUp size={14} aria-hidden />
          ) : (
            <SlidersHorizontal size={14} aria-hidden />
          )}
          {t('search:filters')}
        </Collapsible.Trigger>
        <ul aria-label={t('search:activeFilters')} className="contents">
          {orderedChips.map((chip) => (
            <li key={chip.key} className="flex shrink-0">
              {/* Flex so the avatar's baseline does not grow a line box under the chip. */}
              <Chip
                surface="elevated"
                leading={chip.leading}
                onRemove={chip.onRemove}
                removeLabel={t('search:removeFilter', { label: chip.label })}
              >
                {chip.label}
              </Chip>
            </li>
          ))}
        </ul>
        {orderedChips.length > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className={clsx([
              'text-muted-foreground hover:text-foreground shrink-0 rounded-md px-2 py-1 text-sm',
              'focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none',
            ])}
          >
            {t('search:clearFilters')}
          </button>
        ) : null}
      </div>

      <Collapsible.Content
        className={clsx([
          'overflow-hidden',
          'data-[state=open]:animate-[radixCollapsibleSlideDown_300ms_ease-out]',
          'data-[state=closed]:animate-[radixCollapsibleSlideUp_300ms_ease-out]',
          'will-change-[height]',
        ])}
      >
        <div className="flex flex-col gap-3 py-1">
          <Divider />
          <div className="@container px-0.5">
            {/* One column when the form is narrow, label | control once it fits. */}
            <div className="grid grid-cols-1 gap-y-1.5 @min-[15rem]:grid-cols-[max-content_minmax(0,1fr)] @min-[15rem]:items-center @min-[15rem]:gap-x-4">
              <FilterSelect
                label={t('search:user')}
                value={value.user}
                options={userOptions}
                disabled={usersLoading}
                onValueChange={(user) => onChange({ user })}
              />

              <FilterSelect
                label={t('search:period')}
                value={periodValue}
                options={periodOptions}
                onValueChange={(range) => {
                  if (range === '30d' || range === '6m' || range === '12m') {
                    onChange({ range, from: undefined, to: undefined });
                    return;
                  }
                  if (range === 'custom') {
                    onChange({ range: 'custom' });
                    return;
                  }
                  onChange({
                    range: undefined,
                    from: undefined,
                    to: undefined,
                  });
                }}
              />

              {periodValue === 'custom' ? (
                <>
                  <FilterField label={t('search:from')} htmlFor={fromId}>
                    <input
                      id={fromId}
                      type="date"
                      value={value.from ?? ''}
                      max={value.to}
                      onChange={handleFromChange}
                      aria-invalid={rangeInvalid}
                      aria-describedby={rangeInvalid ? rangeErrorId : undefined}
                      className={fieldInputClassName}
                    />
                  </FilterField>
                  <FilterField label={t('search:to')} htmlFor={toId}>
                    <input
                      id={toId}
                      type="date"
                      value={value.to ?? ''}
                      min={value.from}
                      onChange={handleToChange}
                      aria-invalid={rangeInvalid}
                      aria-describedby={rangeInvalid ? rangeErrorId : undefined}
                      className={fieldInputClassName}
                    />
                  </FilterField>
                  {rangeInvalid ? (
                    <p
                      id={rangeErrorId}
                      className="col-span-full text-sm text-rose-600 dark:text-rose-400"
                    >
                      {t('search:invalidRange')}
                    </p>
                  ) : null}
                </>
              ) : null}

              <FilterSelect
                label={t('search:channel')}
                value={value.channel}
                options={channelOptions}
                disabled={channelsLoading}
                onValueChange={(channel) => onChange({ channel })}
              />

              <FilterSelect
                label={t('search:type')}
                value={value.type}
                options={typeOptions}
                onValueChange={(type) =>
                  onChange({
                    type:
                      type === 'post' || type === 'reply' ? type : undefined,
                  })
                }
              />

              <FilterField label={t('search:likedByMe')} htmlFor={likedId}>
                <Switch.Root
                  id={likedId}
                  checked={liked}
                  onCheckedChange={(checked) =>
                    onChange({ liked: checked ? true : undefined })
                  }
                  className={clsx([
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full',
                    // border-2 is the inset. The thumb then travels exactly one thumb width.
                    'border-2 border-transparent',
                    'bg-black/15 transition-colors dark:bg-white/20',
                    'data-[state=checked]:bg-cyan-600',
                    'focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none',
                  ])}
                >
                  <Switch.Thumb
                    className={clsx([
                      'pointer-events-none block size-5 rounded-full bg-white',
                      'transition-transform',
                      'data-[state=unchecked]:translate-x-0',
                      'data-[state=checked]:translate-x-5',
                    ])}
                  />
                </Switch.Root>
              </FilterField>
            </div>
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
