import type { Comment } from '@/graphql';
import { formatCommentDate } from '@/utils/formatDate';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { Avatar } from '@/components/ui/Avatar';
import { PostContextMenu } from '@/components/post/PostContextMenu';

interface PostHeaderProps {
  comment: Comment;
  onEdit?: () => void;
}

export function PostHeader({ comment, onEdit }: PostHeaderProps) {
  const { user } = comment;
  const handle = 'handle';
  const showHandle = false;

  return (
    <div className="flex items-center gap-3">
      <Link to="/u/$name" params={{ name: user.name }}>
        <Avatar
          avatar={user.avatar}
          alt={`${user.name}'s avatar`}
          className="h-12 w-12"
        />
      </Link>
      <div className="flex-1">
        <div className="flex flex-col items-baseline justify-between gap-2 sm:flex-row sm:gap-2">
          <div className="flex items-baseline gap-2 sm:flex-col">
            <Link
              to="/u/$name"
              params={{ name: user.name }}
              className={clsx([
                'text-base leading-none font-bold',
                'underline decoration-transparent',
                'hover:decoration-current',
                'transition-colors duration-200',
              ])}
            >
              {user.name}
            </Link>
            {showHandle && (
              <Link
                to="/u/$name"
                params={{ name: user.name }}
                className={clsx([
                  'text-muted-foreground text-sm leading-none',
                  'underline decoration-transparent',
                  'hover:text-foreground hover:decoration-current',
                  'transition-colors duration-200',
                ])}
              >
                @{handle}
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/post/$id"
              params={{ id: comment.id }}
              className={clsx([
                'text-muted-foreground text-xs leading-none sm:text-sm',
                'underline decoration-transparent',
                'hover:text-foreground hover:decoration-current',
                'transition-colors duration-200',
              ])}
            >
              {formatCommentDate(comment.dateCreated)}
            </Link>

            <PostContextMenu comment={comment} onEdit={onEdit} />
          </div>
        </div>
      </div>
    </div>
  );
}
