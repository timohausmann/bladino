import type { Comment } from '@/graphql';
import { ChannelsDocument, useGraphQLQuery } from '@/graphql';
import {
  formatCommentTimestamp,
  formatRelativeCommentDate,
} from '@/utils/formatDate';
import { Link } from '@tanstack/react-router';
import { Tooltip } from '@/components/ui/Tooltip';
import { UnreadIndicator } from '@/components/post/UnreadIndicator';

interface PostMetadataProps {
  comment: Comment;
  isUnread?: boolean;
}

/**
 * Channel and date metadata shown below the author name in post cards.
 */
export function PostMetadata({ comment, isUnread }: PostMetadataProps) {
  const { data } = useGraphQLQuery(ChannelsDocument);
  const channelId = comment.channel ?? undefined;
  const channel = channelId
    ? data?.channels.find((entry) => entry.id === channelId)
    : undefined;
  const formattedDate = formatRelativeCommentDate(comment.dateCreated);
  const timestamp = formatCommentTimestamp(comment.dateCreated);

  if (!channel && !formattedDate && !isUnread) {
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
      <UnreadIndicator isUnread={isUnread} variant="label" />
      {(formattedDate || isUnread) && channel && ' • '}
      {channel && channelId ? (
        <Link
          to="/channels/$id"
          params={{ id: channelId }}
          className="hover:text-foreground truncate transition-colors"
        >
          #{channel.name}
        </Link>
      ) : null}
    </div>
  );
}
