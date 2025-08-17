import { getUserById } from '@/mocks';
import { PostComment as PostCommentType } from '@/types';
import { Avatar } from './Avatar';

interface PostCommentProps {
    comment: PostCommentType; // Pass the comment object using PostComment type
}

/**
 * PostComment - Compact comment display component
 */
export function PostComment({ comment }: PostCommentProps) {
    // Extract user data from the comment
    const user = getUserById(comment.userId);

    if (!user) {
        console.error(`User not found for comment ${comment.id}`);
        return null;
    }

    const { avatar, name, handle } = user;
    const { content, timestamp } = comment;

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
