import { Avatar } from './Avatar';

interface PostCommentProps {
    avatar: string;
    name: string;
    handle: string;
    timestamp: string;
    content: string;
}

/**
 * PostComment - Compact comment display component
 */
export function PostComment({ avatar, name, handle, timestamp, content }: PostCommentProps) {
    return (
        <div className="flex gap-3 py-3 border-b border-white/10 last:border-b-0">
            <Avatar
                src={avatar}
                alt={`${name}'s avatar`}
                className="w-9 h-9 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-foreground">{name}</span>
                    <span className="text-xs text-muted-foreground">@{handle}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{timestamp}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{content}</p>
            </div>
        </div>
    );
}
