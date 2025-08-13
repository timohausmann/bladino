import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import { MessageCircle } from 'react-feather';
import { extractFirstUrl, parseTextWithLinks } from '../../utils/textUtils';
import { Avatar } from './Avatar';
import { EmojiReaction } from './EmojiReaction';
import { LinkPreview } from './LinkPreview';
import { PostActionButton } from './PostActionButton';

interface PostDetailCardProps {
    postId: number; // Add post ID for navigation
    avatar: string;
    name: string;
    handle: string;
    timestamp: string;
    content: string;
    reactions: { [emoji: string]: number; };
    comments: number;
    likes?: number; // Optional for backward compatibility
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
    comments = 0,
}: PostDetailCardProps) {
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

    return (
        <div className="rounded-xl bg-card text-card-foreground p-4 max-w-full border border-white dark:border-white/10">
            {/* User info and timestamp */}
            <div className="flex mb-3 items-center gap-3">
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

            <div className="mb-3 text-[17px]">
                <p>{parsedContent}</p>
            </div>

            {/* Link Preview (if there's a URL in the content) */}
            {firstUrl && <LinkPreview url={firstUrl} />}

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-white/14 my-4"></div>

            {/* Interaction buttons */}
            <div className="flex justify-between items-center">
                <EmojiReaction reactions={initialReactions} onReaction={handleReaction} />
                <PostActionButton
                    icon={<MessageCircle size={18} />}
                    count={comments}
                    label="Comments"
                    onClick={() => { }}
                />
            </div>
        </div>
    );
} 