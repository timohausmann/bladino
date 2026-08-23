import type { Comment } from '@/graphql';
import { getCommentFiles } from '@/utils/commentUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/Avatar';
import { CommentBody } from '@/components/post/CommentBody';
import { CommentComposerForm } from '@/components/post/CommentComposerForm';
import { FilePreview } from '@/components/ui/FilePreview';
import { PostContextMenu } from '@/components/post/PostContextMenu';
import { PostLikes } from '@/components/post/PostLikes';
import { UnreadIndicator } from '@/components/post/UnreadIndicator';

interface PostCommentProps {
  comment: Comment;
  channel?: string;
  isUnread?: boolean;
}

/**
 * PostComment - Compact comment display component
 */
export function PostComment({ comment, channel, isUnread }: PostCommentProps) {
  const { t } = useTranslation();
  const files = getCommentFiles(comment);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="relative flex gap-3">
      <UnreadIndicator isUnread={isUnread} layout="comment" />
      <Avatar
        avatar={comment.user.avatar}
        alt={t('common:userAvatar', { name: comment.user.name })}
        className="h-6 w-6 shrink-0"
      />

      <div className="min-w-0 flex-1">
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
          <div className="flex min-w-0 flex-col gap-2 pt-px">
            <CommentBody
              body={comment.body}
              weblinks={comment.weblinks}
              linkPreviewVariant="compact"
              parentSurface="inset"
              className="text-foreground min-w-0 text-[15px] leading-6"
            />
            {files.length > 0 && (
              <FilePreview files={files} compact parentSurface="inset" />
            )}
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="flex shrink-0 items-start gap-1">
          <PostLikes comment={comment} variant="compact" />
          <PostContextMenu
            comment={comment}
            onEdit={() => setIsEditing(true)}
            variant="compact"
          />
        </div>
      ) : null}
    </div>
  );
}
