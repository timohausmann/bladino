import type { Comment } from '@/graphql';
import { getCommentFiles } from '@/utils/commentUtils';
import { formatCommentDate } from '@/utils/formatDate';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/Avatar';
import { CommentBody } from '@/components/post/CommentBody';
import { CommentComposerForm } from '@/components/post/CommentComposerForm';
import { FilePreview } from '@/components/ui/FilePreview';
import { PostContextMenu } from '@/components/post/PostContextMenu';
import { PostLikes } from '@/components/post/PostLikes';

interface PostCommentProps {
  comment: Comment;
  channel?: string;
}

/**
 * PostComment - Compact comment display component
 */
export function PostComment({ comment, channel }: PostCommentProps) {
  const { t } = useTranslation();
  const { user } = comment;
  const files = getCommentFiles(comment);
  const handle = 'handle';
  const showHandle = false;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex gap-3 border-b border-white/10 py-3 last:border-b-0">
      <Link
        to="/u/$name"
        params={{ name: user.name }}
        className="shrink-0 transition-opacity duration-200 hover:opacity-80"
      >
        <Avatar
          avatar={user.avatar}
          alt={t('common:userAvatar', { name: user.name })}
          className="h-9 w-9"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-baseline gap-2">
            <Link
              to="/u/$name"
              params={{ name: user.name }}
              className="text-foreground text-sm font-medium transition-colors duration-200 hover:underline"
            >
              {user.name}
            </Link>
            {showHandle && (
              <Link
                to="/u/$name"
                params={{ name: user.name }}
                className="text-muted-foreground hover:text-foreground text-xs transition-colors duration-200"
              >
                @{handle}
              </Link>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-muted-foreground text-xs">
              {formatCommentDate(comment.dateCreated)}
            </span>
            <PostContextMenu
              comment={comment}
              onEdit={() => setIsEditing(true)}
            />
          </div>
        </div>
        {isEditing ? (
          <CommentComposerForm
            mode="edit"
            layout="reply"
            commentId={comment.id}
            channel={channel}
            parent={comment.parent ?? undefined}
            initialContent={comment.body ?? ''}
            initialFiles={files}
            placeholder={t('posts:editReplyPlaceholder')}
            showCancel
            onCancel={() => setIsEditing(false)}
            onSuccess={() => setIsEditing(false)}
            errorMessage={t('errors:updateReplyFailed')}
          />
        ) : (
          <div className="flex flex-col gap-3">
            <CommentBody
              body={comment.body}
              weblinks={comment.weblinks}
              linkPreviewVariant="compact"
              className="text-foreground text-sm leading-relaxed"
            />
            {files.length > 0 && <FilePreview files={files} />}
            <PostLikes comment={comment} />
          </div>
        )}
      </div>
    </div>
  );
}
