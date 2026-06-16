import type { Comment, File as ApiFile } from '@/graphql';
import { extractFirstUrl, parseTextWithLinks } from '@/utils/textUtils';
import { MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { EmojiReaction } from '@/components/ui/EmojiReaction';
import { FilePreview } from '@/components/ui/FilePreview';
import { LinkPreview } from '@/components/ui/LinkPreview';
import { EditPostForm } from '@/components/post/EditPostForm';
import { PostActionButton } from '@/components/post/PostActionButton';
import { PostComment } from '@/components/post/PostComment';
import { PostHeader } from '@/components/post/PostHeader';
import { PostReply } from '@/components/post/PostReply';
import type { LocalDraftFile } from '@/utils/postFileUtils';

interface PostCardProps {
    comment: Comment;
}

function getCommentFiles(comment: Comment): ApiFile[] {
    return (comment.files ?? []).filter((file): file is ApiFile => file != null);
}

function getCommentChildren(comment: Comment): Comment[] {
    return (comment.children ?? []).filter((child): child is Comment => child != null);
}

/**
 * PostCard - A card that displays a post with user info and interactions
 */
export function PostCard({ comment }: PostCardProps) {
    const { user, id: commentId } = comment;
    const children = getCommentChildren(comment);
    const [showComments, setShowComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [body, setBody] = useState(comment.body);
    const [files, setFiles] = useState<ApiFile[]>(() => getCommentFiles(comment));

    useEffect(() => {
        if (!isEditing) {
            setBody(comment.body);
            setFiles(getCommentFiles(comment));
        }
    }, [comment, isEditing]);

    const parsedContent = useMemo(() => parseTextWithLinks(body), [body]);
    const firstUrl = useMemo(() => extractFirstUrl(body), [body]);

    const handleReaction = (emoji: string) => {
        console.log(`Reacted with: ${emoji}`);
    };

    const handleReplySubmit = (replyContent: string) => {
        console.log('Reply submitted:', replyContent);
    };

    const handleReplyCancel = () => {
        // Don't hide comments when canceling reply
    };

    const handleEditSave = (newContent: string, newFiles: LocalDraftFile[]) => {
        setBody(newContent);
        setIsEditing(false);
        console.log('Edit post:', commentId, { body: newContent, files: newFiles });
    };

    return (
        <Card className="flex flex-col gap-6" viewTransitionName={`POST_DETAIL-${commentId}`}>
            <div className="flex flex-col gap-4">
                <PostHeader comment={comment} onEdit={() => setIsEditing(true)} />

                {isEditing ? (
                    <EditPostForm
                        initialContent={body}
                        initialFiles={files}
                        onSave={handleEditSave}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <>
                        <div className="text-[17px]">
                            <p>{parsedContent}</p>
                        </div>

                        {firstUrl && <LinkPreview url={firstUrl} />}

                        {files.length > 0 && <FilePreview files={files} />}
                    </>
                )}

                <div className="h-px bg-gray-200 dark:bg-white/14"></div>

                <div className="flex justify-between items-center">
                    <EmojiReaction reactions={{}} onReaction={handleReaction} />
                    <PostActionButton
                        icon={<MessageCircle size={18} />}
                        count={children.length}
                        label="Comments"
                        onClick={() => setShowComments(!showComments)}
                    />
                </div>
            </div>

            {showComments && (
                <div className="flex flex-col gap-4">
                    <PostReply
                        onSubmit={handleReplySubmit}
                        onCancel={handleReplyCancel}
                        placeholder={`Reply to ${user.name}...`}
                    />

                    {children.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-foreground mb-3">
                                Comments ({children.length})
                            </h4>
                            <div className="space-y-0">
                                {children.map((child, index) => (
                                    <PostComment
                                        key={`${child.id}-${index}`}
                                        comment={child}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
