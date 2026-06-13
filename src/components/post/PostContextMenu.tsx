import { Post, PostComment } from '@/types';
import { isPostComment } from '@/utils/typePredicates';
import * as Popover from '@radix-ui/react-popover';
import { Edit, Flag, Link as LinkIcon, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { ContextMenuButton, ContextMenuDivider, PopoverContent } from '@/components/ui/popover';
import { toast } from '@/components/ui/toast';

interface PostContextMenuProps {
    post: Post | PostComment;
    onEdit?: () => void;
}

/**
 * Context menu items for post actions
 */
export function PostContextMenu({ post, onEdit }: PostContextMenuProps) {

    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    // const currentUser = useUserStore(store => store.currentUser);
    // const isOwner = currentUser?.id === post.userId;
    const isOwner = true;

    const isComment = isPostComment(post);

    const handleReport = () => {
        // TODO: Implement report functionality
        console.log('Report post:', post.id);
        setOpen(false);
    };

    const handleCopyLink = () => {
        if (isComment) {
            navigator.clipboard.writeText(`${window.location.origin}/post/${post.parentPostId}/comment/${post.id}`);
        } else {
            navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
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

    const handleDeleteConfirm = () => {
        console.log('Delete post:', post.id);
        setDeleteOpen(false);
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
                    className="border-none cursor-pointer flex items-center justify-center text-foreground w-10 h-10 rounded-full p-0 transition-colors bg-transparent hover:bg-black/10 dark:hover:bg-white/10"
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
                            label={isComment ? "Edit Comment" : "Edit Post"}
                            icon={Edit}
                            onClick={handleEdit}
                        />
                        <ContextMenuButton
                            id="delete"
                            label={isComment ? "Delete Comment" : "Delete Post"}
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
            onOpenChange={setDeleteOpen}
            title={deleteTitle}
            description={deleteDescription}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={handleDeleteConfirm}
            destructive
        />
        </>
    );
}
