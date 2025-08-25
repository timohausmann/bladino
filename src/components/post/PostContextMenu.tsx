import { useUserStore } from '@/stores/userStore';
import { Post } from '@/types';
import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import { Edit, Flag, Link as LinkIcon, MoreVertical, Trash2 } from 'react-feather';
import { ContextMenuButton, ContextMenuDivider, PopoverContent } from '../ui/popover';

interface PostContextMenuProps {
    post: Post;
}

/**
 * Context menu items for post actions
 */
export function PostContextMenu({ post }: PostContextMenuProps) {

    const [open, setOpen] = useState(false);
    const { currentUser } = useUserStore();
    const isOwner = currentUser?.id === post.userId;

    const handleReport = () => {
        // TODO: Implement report functionality
        console.log('Report post:', post.id);
        setOpen(false);
    };

    const handleCopyLink = () => {
        // TODO: Implement copy link functionality
        navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
        setOpen(false);
    };

    const handleEdit = () => {
        // TODO: Implement edit functionality
        console.log('Edit post:', post.id);
        setOpen(false);
    };

    const handleDelete = () => {
        // TODO: Implement delete functionality
        console.log('Delete post:', post.id);
        setOpen(false);
    };

    return (
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
                            label="Edit Post"
                            icon={Edit}
                            onClick={handleEdit}
                        />
                        <ContextMenuButton
                            id="delete"
                            label="Delete Post"
                            icon={Trash2}
                            onClick={handleDelete}
                            variant="destructive"
                        />
                    </>
                )}

            </PopoverContent>
        </Popover.Root>
    );
}
