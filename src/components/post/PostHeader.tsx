import type { Comment } from '@/graphql';
import { formatCommentDate } from '@/utils/formatDate';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/Avatar';
import { PostContextMenu } from '@/components/post/PostContextMenu';

/** ~one text-sm line tall — used in comment headers. */
export const COMPACT_AVATAR_CLASS = 'h-6 w-6';
export const COMPACT_AVATAR_WIDTH_CLASS = 'w-6';

interface PostHeaderProps {
  comment: Comment;
  onEdit?: () => void;
  /** Hide the ⋯ menu (e.g. dashboard preview cards). */
  showContextMenu?: boolean;
  showDate?: boolean;
  variant?: 'default' | 'compact';
}

export function PostHeader({
  comment,
  onEdit,
  showContextMenu = true,
  showDate = true,
  variant = 'default',
}: PostHeaderProps) {
  const { t } = useTranslation();
  const { user } = comment;
  const handle = 'handle';
  const showHandle = false;
  const isCompact = variant === 'compact';
  const formattedDate = formatCommentDate(comment.dateCreated);

  const dateClassName = clsx([
    'text-muted-foreground leading-none',
    isCompact ? 'text-xs' : 'text-xs sm:text-sm',
    !isCompact && [
      'underline decoration-transparent',
      'hover:text-foreground hover:decoration-current',
      'transition-colors duration-200',
    ],
  ]);

  return (
    <div className={clsx('flex items-center', isCompact ? 'gap-2' : 'gap-3')}>
      <Link to="/u/$name" params={{ name: user.name }}>
        <Avatar
          avatar={user.avatar}
          alt={t('common:userAvatar', { name: user.name })}
          className={isCompact ? COMPACT_AVATAR_CLASS : 'h-10 w-10'}
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col items-baseline justify-between gap-2 sm:flex-row sm:gap-2">
          <div className="flex items-baseline gap-2 sm:flex-col">
            <Link
              to="/u/$name"
              params={{ name: user.name }}
              className={clsx([
                'leading-none',
                isCompact
                  ? 'text-foreground text-sm font-medium hover:underline'
                  : [
                      'text-base font-bold',
                      'underline decoration-transparent',
                      'hover:decoration-current',
                      'transition-colors duration-200',
                    ],
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
            {showDate ? (
              isCompact ? (
                <span className={dateClassName}>{formattedDate}</span>
              ) : (
                <Link
                  to="/post/$id"
                  params={{ id: comment.id }}
                  className={dateClassName}
                >
                  {formattedDate}
                </Link>
              )
            ) : null}
            {showContextMenu && (
              <PostContextMenu comment={comment} onEdit={onEdit} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
