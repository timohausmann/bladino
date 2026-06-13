import { getUserById } from '@/mocks';
import { Post, PostComment as PostCommentType, PostFile } from '@/types';
import { extractFirstUrl, parseTextWithLinks } from '@/utils/textUtils';
import { MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Card } from '../ui/Card';
import { EmojiReaction } from '../ui/EmojiReaction';
import { FilePreview } from '../ui/FilePreview';
import { LinkPreview } from '../ui/LinkPreview';
import { EditPostForm } from './EditPostForm';
import { PostActionButton } from './PostActionButton';
import { PostComment } from './PostComment';
import { PostHeader } from './PostHeader';
import { PostReply } from './PostReply';

interface PostCardProps {
    post: Post; // Pass the entire post object
}

/**
 * PostCard - A card that displays a post with user info and interactions
 */
export function PostCard({
    post,
}: PostCardProps) {
    // Extract user data from the post
    const user = getUserById(post.userId);

    if (!user) {
        console.error(`User not found for post ${post.id}`);
        return null;
    }

    const { handle } = user;
    const { id: postId, reactions = {}, comments = [] } = post;
    const [showComments, setShowComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(post.content);
    const [files, setFiles] = useState<PostFile[]>(post.files ?? []);

    useEffect(() => {
        if (!isEditing) {
            setContent(post.content);
            setFiles(post.files ?? []);
        }
    }, [post, isEditing]);

    // Parse content for links
    const parsedContent = useMemo(() => parseTextWithLinks(content), [content]);

    // Extract the first URL for link preview
    const firstUrl = useMemo(() => extractFirstUrl(content), [content]);

    // Initialize reactions
    const initialReactions = useMemo(() => {
        return reactions;
    }, [reactions]);

    // Handle emoji reaction - in a real app, this would update the post's reactions
    const handleReaction = (emoji: string) => {
        console.log(`Reacted with: ${emoji}`);
    };

    // Handle reply submission
    const handleReplySubmit = (replyContent: string) => {
        console.log('Reply submitted:', replyContent);
        // In a real app, this would add the reply to the post
    };

    // Handle reply cancellation
    const handleReplyCancel = () => {
        // Don't hide comments when canceling reply
    };

    const handleEditSave = (newContent: string, newFiles: PostFile[]) => {
        setContent(newContent);
        setFiles(newFiles);
        setIsEditing(false);
        console.log('Edit post:', postId, { content: newContent, files: newFiles });
    };

    return (
        <Card className="flex flex-col gap-6" viewTransitionName={`POST_DETAIL-${postId}`}>
            <div className="flex flex-col gap-4">
                {/* User info and timestamp */}
                <PostHeader post={post} onEdit={() => setIsEditing(true)} />

                {isEditing ? (
                    <EditPostForm
                        initialContent={content}
                        initialFiles={files}
                        onSave={handleEditSave}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <>
                        <div className="text-[17px]">
                            <p>{parsedContent}</p>
                        </div>

                        {/* Link Preview (if there's a URL in the content) */}
                        {firstUrl && <LinkPreview url={firstUrl} />}

                        {/* File Preview (if there are files) */}
                        {files.length > 0 && <FilePreview files={files} />}
                    </>
                )}

                {/* Divider */}
                <div className="h-px bg-gray-200 dark:bg-white/14"></div>

                {/* Interaction buttons */}
                <div className="flex justify-between items-center">
                    <EmojiReaction reactions={initialReactions} onReaction={handleReaction} />
                    <PostActionButton
                        icon={<MessageCircle size={18} />}
                        count={comments?.length || 0}
                        label="Comments"
                        onClick={() => setShowComments(!showComments)}
                    />
                </div>
            </div>

            {/* Comments section */}
            {showComments && (
                <div className="flex flex-col gap-4">
                    {/* Reply form */}
                    <PostReply
                        onSubmit={handleReplySubmit}
                        onCancel={handleReplyCancel}
                        placeholder={`Reply to @${handle}...`}
                    />

                    {/* Comments list */}
                    {comments && comments.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-foreground mb-3">
                                Comments ({comments.length})
                            </h4>
                            <div className="space-y-0">
                                {comments.map((comment: PostCommentType, index: number) => (
                                    <PostComment
                                        key={`${comment.id}-${index}`}
                                        comment={comment}
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