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
import clsx from 'clsx';
import { Edit, Link as LinkIcon, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '@/components/ui/alert-dialog';
import {
  ContextMenuButton,
  ContextMenuDivider,
  PopoverContent,
} from '@/components/ui/popover';
import { Tooltip } from '@/components/ui/Tooltip';
import { toast } from '@/components/ui/toast';

interface PostContextMenuProps {
  comment: Comment;
  onEdit?: () => void;
  /** Route-specific follow-up after a successful delete (e.g. leave the detail page). */
  onDeleted?: () => void;
  variant?: 'default' | 'compact';
}

/**
 * Context menu items for post actions
 */
export function PostContextMenu({
  comment,
  onEdit,
  onDeleted,
  variant = 'default',
}: PostContextMenuProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentUser = useUserStore((store) => store.currentUser);
  const isOwner = currentUser?.id === comment.user.id;
  const isComment = isReplyComment(comment);
  const queryClient = useQueryClient();

  const { mutateAsync: deleteComment } = useGraphQLMutation(
    DeleteCommentDocument,
  );

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
    toast(t('posts:linkCopied'));
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

      toast(isComment ? t('posts:commentDeleted') : t('posts:postDeleted'));

      setDeleteOpen(false);
      onDeleted?.();
    } catch (error) {
      const message =
        getGraphQLErrorMessage(error) ??
        (error instanceof Error ? error.message : t('errors:deleteFailed'));
      toast(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteTitle = isComment
    ? t('posts:deleteCommentTitle')
    : t('posts:deletePostTitle');
  const deleteDescription = isComment
    ? t('posts:deleteCommentDescription')
    : t('posts:deletePostDescription');

  return (
    <>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Tooltip content={t('posts:moreOptions')}>
          <Popover.Trigger asChild>
            <button
              className={clsx(
                'text-muted-foreground hover:text-foreground flex cursor-pointer items-center justify-center border-none bg-transparent p-0 transition-colors',
                variant === 'compact'
                  ? 'h-8 w-8 rounded-full'
                  : 'text-foreground h-10 w-10 rounded-full hover:bg-black/10 dark:hover:bg-white/10',
              )}
              aria-label={t('posts:postOptions')}
              aria-expanded={open}
              aria-haspopup="menu"
            >
              <MoreVertical size={16} />
            </button>
          </Popover.Trigger>
        </Tooltip>

        <PopoverContent>
          <ContextMenuButton
            id="copy-link"
            label={t('posts:copyLink')}
            icon={LinkIcon}
            onClick={handleCopyLink}
          />
          {isOwner && (
            <>
              <ContextMenuDivider id="divider" />
              <ContextMenuButton
                id="edit"
                label={t('common:edit')}
                icon={Edit}
                onClick={handleEdit}
              />
              <ContextMenuButton
                id="delete"
                label={t('common:delete')}
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
          if (!isDeleting) {
            setDeleteOpen(nextOpen);
          }
        }}
        title={deleteTitle}
        description={deleteDescription}
        confirmLabel={isDeleting ? t('common:deleting') : t('common:delete')}
        cancelLabel={t('common:cancel')}
        onConfirm={() => void handleDeleteConfirm()}
        destructive
      />
    </>
  );
}
