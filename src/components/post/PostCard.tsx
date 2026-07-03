import type { Comment } from '@/graphql';
import { getCommentChildren, getCommentFiles } from '@/utils/commentUtils';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { FilePreview } from '@/components/ui/FilePreview';
import { CommentBody } from '@/components/post/CommentBody';
import { CommentComposerForm } from '@/components/post/CommentComposerForm';
import { PostActionButton } from '@/components/post/PostActionButton';
import { PostComment } from '@/components/post/PostComment';
import { PostHeader } from '@/components/post/PostHeader';
import { PostLikes } from '@/components/post/PostLikes';
import { PostReply } from '@/components/post/PostReply';

interface PostCardProps {
  comment: Comment;
}

/**
 * PostCard - A card that displays a post with user info and interactions
 */
export function PostCard({ comment }: PostCardProps) {
  const { t } = useTranslation();
  const { user, id: commentId } = comment;
  const children = getCommentChildren(comment);
  const files = getCommentFiles(comment);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card
      className="flex flex-col gap-6"
      viewTransitionName={`POST_DETAIL-${commentId}`}
    >
      <div className="flex flex-col gap-4">
        <PostHeader comment={comment} onEdit={() => setIsEditing(true)} />

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

        <Divider />

        <div className="flex items-center justify-between">
          <PostLikes comment={comment} />
          <PostActionButton
            icon={<MessageCircle size={18} />}
            count={children.length}
            label={t('posts:comments')}
            onClick={() => setShowComments(!showComments)}
          />
        </div>
      </div>

      {showComments && (
        <div className="flex flex-col gap-4">
          <PostReply
            parentId={commentId}
            channel={comment.channel ?? undefined}
            placeholder={t('posts:replyToPlaceholder', { name: user.name })}
          />

          {children.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-muted-foreground text-xs tracking-wide uppercase">
                {t('posts:commentsHeading', { count: children.length })}
              </h4>
              <div className="space-y-0">
                {children.map((child, index) => (
                  <PostComment
                    key={`${child.id}-${index}`}
                    comment={child}
                    channel={comment.channel ?? undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
