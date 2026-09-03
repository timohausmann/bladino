import type { Comment } from '@/graphql';
import { ChannelsDocument, useGraphQLQuery } from '@/graphql';
import {
  formatCommentTimestamp,
  formatRelativeCommentDate,
} from '@/utils/formatDate';
import { Link } from '@tanstack/react-router';
import { Tooltip } from '@/components/ui/Tooltip';

interface PostMetadataProps {
  comment: Comment;
}

/**
 * Channel and date metadata shown below the author name in post cards.
 */
export function PostMetadata({ comment }: PostMetadataProps) {
  const { data } = useGraphQLQuery(ChannelsDocument);
  const channelId = comment.channel ?? undefined;
  const channel = channelId
    ? data?.channels.find((entry) => entry.id === channelId)
    : undefined;
  const formattedDate = formatRelativeCommentDate(comment.dateCreated);
  const timestamp = formatCommentTimestamp(comment.dateCreated);

  if (!channel && !formattedDate) {
    return null;
  }

  return (
    <div className="text-muted-foreground flex min-w-0 items-center justify-start gap-1.5 text-left text-xs leading-none">
      {formattedDate ? (
        <Link
          to="/post/$id"
          params={{ id: comment.id }}
          className="hover:text-foreground shrink-0 transition-colors"
        >
          <Tooltip content={timestamp}>
            <time dateTime={comment.dateCreated ?? undefined}>
              {formattedDate}
            </time>
          </Tooltip>
        </Link>
      ) : null}
      {formattedDate && channel && ' • '}
      {channel && channelId ? (
        <Link
          to="/channels/$id"
          params={{ id: channelId }}
          className="hover:text-foreground truncate transition-colors"
        >
          #{channel.name}
        </Link>
      ) : null}

      {channel && formattedDate ? <span aria-hidden>·</span> : null}
    </div>
  );
}
