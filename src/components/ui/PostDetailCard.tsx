import { Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { MessageCircle } from 'react-feather';
import { Post } from '../../utils/samplePosts';
import { extractFirstUrl, parseTextWithLinks } from '../../utils/textUtils';
import { Avatar } from './Avatar';
import { EmojiReaction } from './EmojiReaction';
import { LinkPreview } from './LinkPreview';
import { PostActionButton } from './PostActionButton';
import { PostComment } from './PostComment';
import { PostReply } from './PostReply';

interface PostDetailCardProps {
    postId: number; // Add post ID for navigation
    avatar: string;
    name: string;
    handle: string;
    timestamp: string;
    content: string;
    reactions: { [emoji: string]: number; };
    comments?: Post[]; // Optional comments array
    commentCount?: number; // Optional comment count for backward compatibility
    likes?: number; // Optional for backward compatibility
    currentUserAvatar?: string; // Add current user avatar for reply form
}

/**
 * PostDetailCard - A card that displays a post with user info and interactions
 */
export function PostDetailCard({
    postId,
    avatar,
    name,
    handle,
    timestamp,
    content,
    reactions = {},
    likes, // Keep for backward compatibility
    comments = [],
    commentCount,
    currentUserAvatar,
}: PostDetailCardProps) {
    const [showComments, setShowComments] = useState(false);

    // Parse content for links
    const parsedContent = useMemo(() => parseTextWithLinks(content), [content]);

    // Extract the first URL for link preview
    const firstUrl = useMemo(() => extractFirstUrl(content), [content]);

    // If we have likes but no reactions, initialize reactions with likes
    const initialReactions = useMemo(() => {
        if (Object.keys(reactions).length > 0) {
            return reactions;
        }

        // Backward compatibility: If only likes are provided
        if (likes && likes > 0) {
            return { '👍': likes };
        }

        return {};
    }, [reactions, likes]);

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
        <div className="flex flex-col gap-6 rounded-xl bg-card text-card-foreground p-4 max-w-full border border-white dark:border-white/10">
            <div className="flex flex-col gap-4">
                {/* User info and timestamp */}
                <div className="flex items-center gap-3">
                    <Avatar
                        src={avatar}
                        alt={`${name}'s avatar`}
                        className="w-12 h-12"
                    />
                    <div className="flex-1">
                        <div className="flex justify-between items-baseline gap-2 flex-col sm:flex-row sm:gap-2">
                            <div className="flex gap-2 items-baseline sm:flex-col">
                                <h3 className="font-bold leading-none text-base">{name}</h3>
                                <span className="text-muted-foreground leading-none text-sm">
                                    @{handle}
                                </span>
                            </div>
                            <Link
                                to="/post/$id"
                                params={{ id: postId.toString() }}
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

                {/* Divider */}
                <div className="h-px bg-gray-200 dark:bg-white/14"></div>

                {/* Interaction buttons */}
                <div className="flex justify-between items-center">
                    <EmojiReaction reactions={initialReactions} onReaction={handleReaction} />
                    <PostActionButton
                        icon={<MessageCircle size={18} />}
                        count={commentCount || comments?.length || 0}
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
                                {comments.map((comment, index) => (
                                    <PostComment
                                        key={`${comment.handle}-${index}`}
                                        avatar={comment.avatar}
                                        name={comment.name}
                                        handle={comment.handle}
                                        timestamp={comment.timestamp}
                                        content={comment.content}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 