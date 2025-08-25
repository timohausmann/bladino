import { getUserById } from '@/mocks';
import { Post } from '@/types';
import { Link } from '@tanstack/react-router';
import clsx from "clsx";
import { Avatar } from "../ui/Avatar";
import { PostContextMenu } from './PostContextMenu';

interface PostHeaderProps {
    post: Post;
}

export function PostHeader({ post }: PostHeaderProps) {

    // Get user data from the post
    const user = getUserById(post.userId);
    if (!user) {
        console.error(`User not found for post ${post.id}`);
        return null;
    }

    const { avatar, name, handle } = user;

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

                        <PostContextMenu post={post} />
                    </div>
                </div>
            </div>
        </div>
    );
}