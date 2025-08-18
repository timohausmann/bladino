import { getUserById } from '@/mocks';
import { Post, PostComment as PostCommentType } from '@/types';
import { extractFirstUrl, parseTextWithLinks } from '@/utils/textUtils';
import { Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { MessageCircle } from 'react-feather';
import { Avatar } from './Avatar';
import { Card } from './Card';
import { EmojiReaction } from './EmojiReaction';
import { FilePreview } from './FilePreview';
import { LinkPreview } from './LinkPreview';
import { PostActionButton } from './PostActionButton';
import { PostComment } from './PostComment';
import { PostReply } from './PostReply';

interface PostDetailCardProps {
    post: Post; // Pass the entire post object
    currentUserAvatar?: string; // Add current user avatar for reply form
}

/**
 * PostDetailCard - A card that displays a post with user info and interactions
 */
export function PostDetailCard({
    post,
    currentUserAvatar,
}: PostDetailCardProps) {
    // Extract user data from the post
    const user = getUserById(post.userId);

    if (!user) {
        console.error(`User not found for post ${post.id}`);
        return null;
    }

    const { avatar, name, handle } = user;
    const { id: postId, content, timestamp, reactions = {}, comments = [] } = post;
    const [showComments, setShowComments] = useState(false);

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

    return (
        <Card className="flex flex-col gap-6" viewTransitionName={`POST_DETAIL-${postId}`}>
            <div className="flex flex-col gap-4">
                {/* User info and timestamp */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/u/$handle"
                        params={{ handle }}
                        className="hover:opacity-80 transition-opacity duration-200"
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
                                    className="font-bold leading-none text-base hover:underline transition-colors duration-200"
                                >
                                    {name}
                                </Link>
                                <Link
                                    to="/u/$handle"
                                    params={{ handle }}
                                    className="text-muted-foreground leading-none text-sm hover:text-foreground transition-colors duration-200"
                                >
                                    @{handle}
                                </Link>
                            </div>
                            <Link
                                to="/post/$id"
                                params={{ id: postId }}
                                className="text-muted-foreground leading-none text-xs sm:text-sm hover:text-foreground transition-colors duration-200 underline decoration-transparent hover:decoration-current"
                            >
                                {timestamp}
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="text-[17px]">
                    <p>{parsedContent}</p>
                </div>

                {/* Link Preview (if there's a URL in the content) */}
                {firstUrl && <LinkPreview url={firstUrl} />}

                {/* File Preview (if there are files) */}
                {post.files && post.files.length > 0 && <FilePreview files={post.files} />}

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
                        currentUserAvatar={currentUserAvatar}
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