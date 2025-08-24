import { getUserById } from '@/mocks';
import { useUserStore } from '@/stores/userStore';
import { Post } from '@/types';
import * as Popover from '@radix-ui/react-popover';
import { Link } from '@tanstack/react-router';
import clsx from "clsx";
import { useState } from 'react';
import { Edit, Flag, Link as LinkIcon, MoreVertical, Trash2 } from 'react-feather';
import { Avatar } from "../ui/Avatar";

interface PostHeaderProps {
    post: Post;
}

export function PostHeader({ post }: PostHeaderProps) {
    const [open, setOpen] = useState(false);
    const { currentUser } = useUserStore();

    // Get user data from the post
    const user = getUserById(post.userId);
    if (!user) {
        console.error(`User not found for post ${post.id}`);
        return null;
    }

    const { avatar, name, handle } = user;
    const isOwner = currentUser?.id === post.userId;

    const handleMenuClose = () => {
        setOpen(false);
    };

    const handleReport = () => {
        // TODO: Implement report functionality
        console.log('Report post:', post.id);
        handleMenuClose();
    };

    const handleCopyLink = () => {
        // TODO: Implement copy link functionality
        navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
        handleMenuClose();
    };

    const handleEdit = () => {
        // TODO: Implement edit functionality
        console.log('Edit post:', post.id);
        handleMenuClose();
    };

    const handleDelete = () => {
        // TODO: Implement delete functionality
        console.log('Delete post:', post.id);
        handleMenuClose();
    };

    return (
        <div className="flex items-center gap-3">
            <Link
                to="/u/$handle"
                params={{ handle }}
            >
                <Avatar
                    src={avatar}
                    alt={`${name}'s avatar`}
                    className="w-12 h-12"
                />
            </Link>
            <div className="flex-1">
                <div className="flex justify-between items-baseline gap-2 flex-col sm:flex-row sm:gap-2">
                    <div className="flex gap-2 items-baseline sm:flex-col">
                        <Link
                            to="/u/$handle"
                            params={{ handle }}
                            className={clsx([
                                "font-bold leading-none text-base",
                                "underline decoration-transparent",
                                "hover:decoration-current",
                                "transition-colors duration-200"
                            ])}
                        >
                            {name}
                        </Link>
                        <Link
                            to="/u/$handle"
                            params={{ handle }}
                            className={clsx([
                                "text-muted-foreground leading-none text-sm",
                                "underline decoration-transparent",
                                "hover:text-foreground hover:decoration-current",
                                "transition-colors duration-200"
                            ])}
                        >
                            @{handle}
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            to="/post/$id"
                            params={{ id: post.id }}
                            className={clsx([
                                "text-muted-foreground leading-none text-xs sm:text-sm",
                                "underline decoration-transparent",
                                "hover:text-foreground hover:decoration-current",
                                "transition-colors duration-200"
                            ])}
                        >
                            {post.timestamp}
                        </Link>

                        {/* Vertical ellipsis menu */}
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

                            <Popover.Portal>
                                <Popover.Content
                                    className="z-50 w-48 rounded-lg bg-white dark:bg-neutral-900 p-2 shadow-lg border border-neutral-200 dark:border-neutral-700"
                                    sideOffset={8}
                                    align="end"
                                >
                                    <div className="space-y-1">
                                        {/* Report option - always visible */}
                                        <button
                                            onClick={handleReport}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150"
                                        >
                                            <Flag size={16} />
                                            Report
                                        </button>

                                        {/* Copy Link option - always visible */}
                                        <button
                                            onClick={handleCopyLink}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150"
                                        >
                                            <LinkIcon size={16} />
                                            Copy Link
                                        </button>

                                        {/* Owner-only options */}
                                        {isOwner && (
                                            <>
                                                <div className="border-t border-neutral-200 dark:border-neutral-700 my-1" />

                                                <button
                                                    onClick={handleEdit}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150"
                                                >
                                                    <Edit size={16} />
                                                    Edit Post
                                                </button>

                                                <button
                                                    onClick={handleDelete}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-md hover:bg-red-900/20 transition-colors duration-150"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete Post
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    <Popover.Arrow className="fill-white dark:fill-neutral-700" />
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>
                    </div>
                </div>
            </div>
        </div>
    );
}