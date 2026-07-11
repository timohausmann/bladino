import type { Comment } from '@/graphql';
import { formatRelativeCommentDate } from '@/utils/formatDate';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/Avatar';
import { PostContextMenu } from '@/components/post/PostContextMenu';
import { PostMetadata } from '@/components/post/PostMetadata';

interface PostHeaderProps {
  comment: Comment;
  onEdit?: () => void;
  /** Hide the ⋯ menu (e.g. dashboard preview cards). */
  showContextMenu?: boolean;
  showDate?: boolean;
  /** Channel and date row below the author name (used in PostCard). */
  showMetadata?: boolean;
}

export function PostHeader({
  comment,
  onEdit,
  showContextMenu = true,
  showDate = true,
  showMetadata = false,
}: PostHeaderProps) {
  const { t } = useTranslation();
  const { user } = comment;
  const handle = 'handle';
  const showHandle = false;
  const formattedDate = formatRelativeCommentDate(comment.dateCreated);

  return (
    <div className="flex items-center gap-3">
      <Link to="/u/$name" params={{ name: user.name }}>
        <Avatar
          avatar={user.avatar}
          alt={t('common:userAvatar', { name: user.name })}
          className="h-10 w-10"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col items-baseline justify-between gap-2 sm:flex-row sm:gap-2">
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex min-w-0 items-baseline gap-2">
              <Link
                to="/u/$name"
                params={{ name: user.name }}
                className="min-w-0 truncate text-base leading-none font-bold underline decoration-transparent transition-colors duration-200 hover:decoration-current"
              >
                {user.name}
              </Link>
              {showDate && formattedDate ? (
                <Link
                  to="/post/$id"
                  params={{ id: comment.id }}
                  className="text-muted-foreground hover:text-foreground text-xs leading-none underline decoration-transparent transition-colors duration-200 hover:decoration-current"
                >
                  {formattedDate}
                </Link>
              ) : null}
            </div>
            {showMetadata ? <PostMetadata comment={comment} /> : null}
            {showHandle && (
              <Link
                to="/u/$name"
                params={{ name: user.name }}
                className="text-muted-foreground hover:text-foreground text-sm leading-none underline decoration-transparent transition-colors duration-200 hover:decoration-current"
              >
                @{handle}
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showContextMenu && (
              <PostContextMenu comment={comment} onEdit={onEdit} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
