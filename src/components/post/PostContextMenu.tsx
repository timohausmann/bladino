import type { Comment } from '@/graphql';
import {
  DeleteCommentDocument,
  getGraphQLErrorMessage,
  useGraphQLMutation,
} from '@/graphql';
import { isReplyComment } from '@/utils/typePredicates';
import { useUserStore } from '@/stores/userStore';
import * as Popover from '@radix-ui/react-popover';
import { useQueryClient } from '@tanstack/react-query';
import { useMatch, useNavigate } from '@tanstack/react-router';
import {
  Edit,
  Flag,
  Link as LinkIcon,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/alert-dialog';
import {
  ContextMenuButton,
  ContextMenuDivider,
  PopoverContent,
} from '@/components/ui/popover';
import { toast } from '@/components/ui/toast';

interface PostContextMenuProps {
  comment: Comment;
  onEdit?: () => void;
}

/**
 * Context menu items for post actions
 */
export function PostContextMenu({ comment, onEdit }: PostContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentUser = useUserStore((store) => store.currentUser);
  const isOwner = currentUser?.id === comment.user.id;
  const isComment = isReplyComment(comment);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const postDetailMatch = useMatch({
    from: '/_authenticated/post/$id',
    shouldThrow: false,
  });

  const { mutateAsync: deleteComment } = useGraphQLMutation(DeleteCommentDocument);

  const handleReport = () => {
    console.log('Report post:', comment.id);
    setOpen(false);
  };

  const handleCopyLink = () => {
    if (isComment && comment.parent) {
      navigator.clipboard.writeText(
        `${window.location.origin}/post/${comment.parent}/comment/${comment.id}`,
      );
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/post/${comment.id}`,
      );
    }
    toast('Link copied!');
    setOpen(false);
  };

  const handleEdit = () => {
    onEdit?.();
    setOpen(false);
  };

  const handleDeleteClick = () => {
    setOpen(false);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      await deleteComment({ id: comment.id });

      await queryClient.invalidateQueries({ queryKey: ['CommentFeed'] });
      await queryClient.invalidateQueries({
        queryKey: ['Comment', { id: comment.id }],
      });

      if (comment.parent) {
        await queryClient.invalidateQueries({
          queryKey: ['Comment', { id: comment.parent }],
        });
      }

      toast(
        isComment
          ? 'Comment deleted successfully!'
          : 'Post deleted successfully!',
      );

      setDeleteOpen(false);

      if (
        !isComment &&
        postDetailMatch?.params.id === String(comment.id)
      ) {
        void navigate({ to: '/' });
      }
    } catch (error) {
      const message =
        getGraphQLErrorMessage(error) ??
        (error instanceof Error ? error.message : 'Failed to delete');
      toast(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteTitle = isComment ? 'Delete comment?' : 'Delete post?';
  const deleteDescription = isComment
    ? 'This comment will be permanently removed. This action cannot be undone.'
    : 'This post will be permanently removed. This action cannot be undone.';

  return (
    <>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            className="text-foreground flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Post options"
            title="More options"
          >
            <MoreVertical size={16} />
          </button>
        </Popover.Trigger>

        <PopoverContent>
          <ContextMenuButton
            id="report"
            label="Report"
            icon={Flag}
            onClick={handleReport}
            disabled
          />
          <ContextMenuButton
            id="copy-link"
            label="Copy Link"
            icon={LinkIcon}
            onClick={handleCopyLink}
          />
          {isOwner && (
            <>
              <ContextMenuDivider id="divider" />
              <ContextMenuButton
                id="edit"
                label={isComment ? 'Edit Comment' : 'Edit Post'}
                icon={Edit}
                onClick={handleEdit}
              />
              <ContextMenuButton
                id="delete"
                label={isComment ? 'Delete Comment' : 'Delete Post'}
                icon={Trash2}
                onClick={handleDeleteClick}
                variant="destructive"
              />
            </>
          )}
        </PopoverContent>
      </Popover.Root>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(nextOpen) => {
          // Block dismiss (Escape/outside click) while the delete request is in flight.
          if (!isDeleting) {
            setDeleteOpen(nextOpen);
          }
        }}
        title={deleteTitle}
        description={deleteDescription}
        confirmLabel={isDeleting ? 'Deleting…' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={() => void handleDeleteConfirm()}
        destructive
      />
    </>
  );
}
