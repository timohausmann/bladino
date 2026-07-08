import type { Comment } from '@/graphql';
import { getCommentFiles } from '@/utils/commentUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CommentBody } from '@/components/post/CommentBody';
import { CommentComposerForm } from '@/components/post/CommentComposerForm';
import { FilePreview } from '@/components/ui/FilePreview';
import {
  PostHeader,
  COMPACT_AVATAR_WIDTH_CLASS,
} from '@/components/post/PostHeader';
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
  const files = getCommentFiles(comment);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <PostHeader
        comment={comment}
        variant="compact"
        onEdit={() => setIsEditing(true)}
      />

      <div className="flex gap-2">
        <div className={`${COMPACT_AVATAR_WIDTH_CLASS} shrink-0`} aria-hidden />
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
            <div className="flex flex-col gap-3">
              <CommentBody
                body={comment.body}
                weblinks={comment.weblinks}
                linkPreviewVariant="compact"
                className="text-foreground text-sm leading-relaxed"
              />
              {files.length > 0 && <FilePreview files={files} compact />}
              <PostLikes comment={comment} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
