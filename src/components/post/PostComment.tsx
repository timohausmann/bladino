import type { Comment } from '@/graphql';
import { formatCommentDate } from '@/utils/formatDate';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { CommentBody } from '@/components/post/CommentBody';
import { EditPostForm } from '@/components/post/EditPostForm';
import { PostContextMenu } from '@/components/post/PostContextMenu';

interface PostCommentProps {
    comment: Comment;
}

/**
 * PostComment - Compact comment display component
 */
export function PostComment({ comment }: PostCommentProps) {
    const { user } = comment;
    const handle = 'handle';
    const showHandle = false;
    const [isEditing, setIsEditing] = useState(false);
    const [body, setBody] = useState(comment.body);

    useEffect(() => {
        if (!isEditing) {
            setBody(comment.body);
        }
    }, [comment.body, isEditing]);

    const handleEditSave = (newContent: string) => {
        setBody(newContent);
        setIsEditing(false);
        console.log('Edit comment:', comment.id, { body: newContent });
    };

    return (
        <div className="flex gap-3 py-3 border-b border-white/10 last:border-b-0">
            <Link
                to="/u/$name"
                params={{ name: user.name }}
                className="shrink-0 hover:opacity-80 transition-opacity duration-200"
            >
                <Avatar
                    avatar={user.avatar}
                    alt={`${user.name}'s avatar`}
                    className="w-9 h-9"
                />
            </Link>
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                    <Link
                        to="/u/$name"
                        params={{ name: user.name }}
                        className="text-sm font-medium text-foreground hover:underline transition-colors duration-200"
                    >
                        {user.name}
                    </Link>
                    {showHandle && (
                        <Link
                            to="/u/$name"
                            params={{ name: user.name }}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                            @{handle}
                        </Link>
                    )}
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                        {formatCommentDate(comment.dateCreated)}
                    </span>
                </div>
                {isEditing ? (
                    <EditPostForm
                        initialContent={body ?? ''}
                        onSave={(newContent) => handleEditSave(newContent)}
                        onCancel={() => setIsEditing(false)}
                        allowFiles={false}
                        saveLabel="Save"
                    />
                ) : (
                    <CommentBody
                        body={body}
                        weblinks={comment.weblinks}
                        className="text-sm text-foreground leading-relaxed"
                    />
                )}
            </div>
            <PostContextMenu comment={comment} onEdit={() => setIsEditing(true)} />
        </div>
    );
}
