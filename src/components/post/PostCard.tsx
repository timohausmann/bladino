import type { Comment } from '@/graphql';
import { getCommentChildren, getCommentFiles } from '@/utils/commentUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { floatingSurfaceClassName } from '@/components/ui/Card';
import { FilePreview } from '@/components/ui/FilePreview';
import { CommentBody } from '@/components/post/CommentBody';
import { CommentComposerForm } from '@/components/post/CommentComposerForm';
import { PostContextMenu } from '@/components/post/PostContextMenu';
import { PostComment } from '@/components/post/PostComment';
import { PostHeader } from '@/components/post/PostHeader';
import { PostLikes } from '@/components/post/PostLikes';
import { PostReply } from '@/components/post/PostReply';
import { UnreadIndicator } from '@/components/post/UnreadIndicator';

interface PostCardProps {
  comment: Comment;
  isUnread?: boolean;
  getIsUnread?: (comment: Comment) => boolean;
  highlightedCommentId?: string;
  onDeleted?: () => void;
}

/**
 * PostCard - Main post as a floating card; nested comments stack inside.
 */
export function PostCard({
  comment,
  isUnread,
  getIsUnread,
  highlightedCommentId,
  onDeleted,
}: PostCardProps) {
  const { t } = useTranslation();
  const { id: commentId } = comment;
  const children = getCommentChildren(comment);
  const files = getCommentFiles(comment);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="relative">
      <UnreadIndicator isUnread={isUnread} layout="card" />
      <article
        className={`border-surface-border bg-inset overflow-hidden rounded-xl border ${floatingSurfaceClassName}`}
        style={{ viewTransitionName: `POST_DETAIL-${commentId}` }}
      >
        <div className="bg-surface text-surface-foreground flex flex-col gap-4 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <PostHeader
                comment={comment}
                onEdit={() => setIsEditing(true)}
                showDate={false}
                showMetadata
                showContextMenu={false}
              />
            </div>
            <div className="flex min-w-0 shrink-0 items-center gap-2">
              <PostLikes comment={comment} variant="textOnly" />
              <PostLikes comment={comment} variant="compact" />
              <PostContextMenu
                comment={comment}
                onEdit={() => setIsEditing(true)}
                onDeleted={onDeleted}
                variant="compact"
              />
            </div>
          </div>

          {isEditing ? (
            <CommentComposerForm
              mode="edit"
              layout="card"
              commentId={commentId}
              channel={comment.channel ?? undefined}
              initialContent={comment.body ?? ''}
              initialFiles={files}
              showCancel
              onCancel={() => setIsEditing(false)}
              onSuccess={() => setIsEditing(false)}
              errorMessage={t('errors:updatePostFailed')}
            />
          ) : (
            <>
              <CommentBody body={comment.body} weblinks={comment.weblinks} />

              {files.length > 0 && <FilePreview files={files} />}
            </>
          )}
        </div>

        {children.length > 0 || !isEditing ? (
          <div className="bg-inset flex flex-col gap-4 rounded-xl px-4 pt-5 pb-3">
            {children.map((child, index) => (
              <div key={`${child.id}-${index}`}>
                <PostComment
                  comment={child}
                  channel={comment.channel ?? undefined}
                  isUnread={getIsUnread?.(child)}
                  isHighlighted={child.id === highlightedCommentId}
                />
              </div>
            ))}

            <div>
              <PostReply
                parentId={commentId}
                channel={comment.channel ?? undefined}
              />
            </div>
          </div>
        ) : null}
      </article>
    </div>
  );
}
