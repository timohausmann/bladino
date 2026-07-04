import type { Comment } from '@/graphql';
import { getCommentChildren, getCommentFiles } from '@/utils/commentUtils';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
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
 * PostCard - Main post and each comment as its own card, stacked with minimal gaps.
 */
export function PostCard({ comment }: PostCardProps) {
  const { t } = useTranslation();
  const { id: commentId } = comment;
  const children = getCommentChildren(comment);
  const files = getCommentFiles(comment);
  const [showComments, setShowComments] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <Card
        className="flex flex-col gap-4"
        viewTransitionName={`POST_DETAIL-${commentId}`}
      >
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

        <div className="flex items-center justify-between">
          <PostLikes comment={comment} />
          <PostActionButton
            icon={<MessageCircle size={18} />}
            count={children.length}
            label={t('posts:comments')}
            onClick={() => setShowComments(!showComments)}
          />
        </div>
      </Card>

      {showComments && (
        <div className="ml-6 flex flex-col gap-1">
          {children.map((child, index) => (
            <PostComment
              key={`${child.id}-${index}`}
              comment={child}
              channel={comment.channel ?? undefined}
            />
          ))}

          <Card>
            <PostReply
              parentId={commentId}
              channel={comment.channel ?? undefined}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
