import { CreatePost } from '@/components/create/CreatePost';
import { CommentFeed, FeedStreamHeader } from '@/components/feed';
import { ResourceError } from '@/components/ui/ResourceError';
import { ResourceNotFound } from '@/components/ui/ResourceNotFound';
import {
  ChannelsDocument,
  getGraphQLErrorMessage,
  useGraphQLQuery,
} from '@/graphql';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Channel view — shows posts filtered by the selected channel.
 */
export function Channels() {
  const { t } = useTranslation();
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGraphQLQuery(ChannelsDocument);
  const channels = data?.channels ?? [];

  useEffect(() => {
    if (!id && channels.length > 0) {
      navigate({
        to: '/channels/$id',
        params: { id: channels[0].id },
        replace: true,
      });
    }
  }, [id, channels, navigate]);

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{t('channels:loading')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <ResourceError
        resource="channel"
        message={getGraphQLErrorMessage(error)}
      />
    );
  }

  if (channels.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{t('channels:empty')}</p>
      </div>
    );
  }

  if (!id) {
    return null;
  }

  const channel = channels.find((entry) => entry.id === id);

  if (!channel) {
    return <ResourceNotFound resource="channel" />;
  }

  return (
    <>
      <FeedStreamHeader>#{channel.name}</FeedStreamHeader>

      <CreatePost channel={id} />

      <CommentFeed
        filter={{ channel: id }}
        emptyMessage={t('channels:emptyFeed')}
      />
    </>
  );
}
