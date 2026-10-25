import { InlineSelect } from '@/components/ui/InlineSelect';
import { ChannelsDocument, useGraphQLQuery } from '@/graphql';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

/** Sentinel value for the optional “no channel” option in Radix Select. */
const NO_CHANNEL_VALUE = '__none__';

function formatChannelLabel(name: string) {
  return `#${name}`;
}

export interface CreatePostChannelFieldProps {
  value?: string;
  onValueChange: (channelId: string | undefined) => void;
}

/**
 * Optional channel picker shown when creating posts on the home feed.
 */
export function CreatePostChannelField({
  value,
  onValueChange,
}: CreatePostChannelFieldProps) {
  const { t } = useTranslation();
  const { data, isLoading } = useGraphQLQuery(ChannelsDocument);
  const channels = data?.channels ?? [];

  const isNoChannel = !value;
  const selectValue = value ?? NO_CHANNEL_VALUE;

  return (
    <InlineSelect
      value={selectValue}
      onValueChange={(nextValue) =>
        onValueChange(nextValue === NO_CHANNEL_VALUE ? undefined : nextValue)
      }
      options={[
        { value: NO_CHANNEL_VALUE, label: t('posts:noChannel') },
        ...channels.map((channel) => ({
          value: channel.id,
          label: formatChannelLabel(channel.name),
        })),
      ]}
      ariaLabel={t('posts:channelLabel')}
      placeholder={t('posts:channelLabel')}
      disabled={isLoading}
      triggerClassName={clsx(
        'max-w-[12rem] disabled:opacity-100',
        isNoChannel && 'text-neutral-500 dark:text-neutral-400',
        !isNoChannel && 'font-medium text-foreground',
        !isLoading &&
          '[&_[data-placeholder]]:text-cyan-700 dark:[&_[data-placeholder]]:text-cyan-600',
      )}
      valueClassName={
        isNoChannel
          ? 'font-normal text-neutral-500 dark:text-neutral-400'
          : 'font-medium text-foreground'
      }
      getItemClassName={(option, isSelected) =>
        isSelected && option.value !== NO_CHANNEL_VALUE
          ? 'font-medium text-foreground'
          : undefined
      }
    />
  );
}
