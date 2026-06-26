import type { Comment } from '@/graphql';
import { getCommentFiles } from '@/utils/commentUtils';
import { formatCommentDate } from '@/utils/formatDate';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { CommentBody } from '@/components/post/CommentBody';
import { CommentComposerForm } from '@/components/post/CommentComposerForm';
import { FilePreview } from '@/components/ui/FilePreview';
import { PostContextMenu } from '@/components/post/PostContextMenu';

interface PostCommentProps {
  comment: Comment;
  channel?: string;
}

/**
 * PostComment - Compact comment display component
 */
export function PostComment({ comment, channel }: PostCommentProps) {
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
          alt={`${user.name}'s avatar`}
          className="h-9 w-9"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
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
          <span className="text-muted-foreground text-xs">•</span>
          <span className="text-muted-foreground text-xs">
            {formatCommentDate(comment.dateCreated)}
          </span>
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
            placeholder="Edit reply..."
            showCancel
            onCancel={() => setIsEditing(false)}
            onSuccess={() => setIsEditing(false)}
            errorMessage="Failed to update reply"
          />
        ) : (
          <>
            <CommentBody
              body={comment.body}
              weblinks={comment.weblinks}
              className="text-foreground text-sm leading-relaxed"
            />
            {files.length > 0 && <FilePreview files={files} />}
          </>
        )}
      </div>
      <PostContextMenu comment={comment} onEdit={() => setIsEditing(true)} />
    </div>
  );
}
