import { Link } from '@tanstack/react-router';
import clsx from "clsx";
import { Avatar } from "../ui/Avatar";

interface PostHeaderProps {
    handle: string;
    avatar: string;
    name: string;
    postId: string;
    timestamp: string;
}

export function PostHeader({ handle, avatar, name, postId, timestamp }: PostHeaderProps) {
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
                    <Link
                        to="/post/$id"
                        params={{ id: postId }}
                        className={clsx([
                            "text-muted-foreground leading-none text-xs sm:text-sm",
                            "underline decoration-transparent",
                            "hover:text-foreground hover:decoration-current",
                            "transition-colors duration-200"
                        ])}
                    >
                        {timestamp}
                    </Link>
                </div>
            </div>
        </div>
    );
}