import { ChannelsDocument, useGraphQLQuery } from '@/graphql';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

interface PostPostedInProps {
  channelId: string;
}

/**
 * Shows which channel a post belongs to on the post detail page.
 */
export function PostPostedIn({ channelId }: PostPostedInProps) {
  const { t } = useTranslation();
  const { data } = useGraphQLQuery(ChannelsDocument);
  const channel = data?.channels.find((entry) => entry.id === channelId);

  if (!channel) {
    return null;
  }

  return (
    <p className="text-muted-foreground text-sm">
      {t('posts:postedInPrefix')}{' '}
      <Link
        to="/channels/$id"
        params={{ id: channelId }}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        #{channel.name}
      </Link>
    </p>
  );
}
