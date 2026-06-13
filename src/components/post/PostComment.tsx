import { Avatar } from '@/components/ui/Avatar';
import { getUserById } from '@/mocks';
import { PostComment as PostCommentType } from '@/types';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { EditPostForm } from './EditPostForm';
import { PostContextMenu } from './PostContextMenu';

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
    const { timestamp } = comment;
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(comment.content);

    useEffect(() => {
        if (!isEditing) {
            setContent(comment.content);
        }
    }, [comment.content, isEditing]);

    const handleEditSave = (newContent: string) => {
        setContent(newContent);
        setIsEditing(false);
        console.log('Edit comment:', comment.id, { content: newContent });
    };

    return (
        <div className="flex gap-3 py-3 border-b border-white/10 last:border-b-0">
            <Link
                to="/u/$handle"
                params={{ handle }}
                className="flex-shrink-0 hover:opacity-80 transition-opacity duration-200"
            >
                <Avatar
                    src={avatar}
                    alt={`${name}'s avatar`}
                    className="w-9 h-9"
                />
            </Link>
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                    <Link
                        to="/u/$handle"
                        params={{ handle }}
                        className="text-sm font-medium text-foreground hover:underline transition-colors duration-200"
                    >
                        {name}
                    </Link>
                    <Link
                        to="/u/$handle"
                        params={{ handle }}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                        @{handle}
                    </Link>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{timestamp}</span>
                </div>
                {isEditing ? (
                    <EditPostForm
                        initialContent={content}
                        onSave={(newContent) => handleEditSave(newContent)}
                        onCancel={() => setIsEditing(false)}
                        allowFiles={false}
                        saveLabel="Save"
                    />
                ) : (
                    <p className="text-sm text-foreground leading-relaxed">{content}</p>
                )}
            </div>
            <PostContextMenu post={comment} onEdit={() => setIsEditing(true)} />
        </div>
    );
}
