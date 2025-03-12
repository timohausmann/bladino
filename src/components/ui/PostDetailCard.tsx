import React, { useMemo } from 'react';
import { MessageCircle } from 'react-feather';
import { extractFirstUrl, parseTextWithLinks } from '../../utils/textUtils';
import { EmojiReaction } from './EmojiReaction';
import { LinkPreview } from './LinkPreview';

interface PostDetailCardProps {
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
        <div className="rounded-xl bg-card text-card-foreground p-4 mb-4 max-w-full border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
            {/* User info and timestamp */}
            <div className="flex mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <img
                        src={avatar}
                        alt={`${name}'s avatar`}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="font-bold mb-0.5">{name}</h3>
                            <span className="text-muted-foreground text-sm">
                                @{handle}
                            </span>
                        </div>
                        <div className="text-muted-foreground text-sm">
                            {timestamp}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-3 text-[17px] leading-relaxed">
                <p>{parsedContent}</p>
            </div>

            {/* Link Preview (if there's a URL in the content) */}
            {firstUrl && <LinkPreview url={firstUrl} />}

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-gray-800 my-3"></div>

            {/* Interaction buttons */}
            <div className="flex justify-between items-center">
                <EmojiReaction reactions={initialReactions} onReaction={handleReaction} />
                <InteractionButton icon={<MessageCircle size={18} />} count={comments} label="Comments" />
            </div>
        </div>
    );
}

interface InteractionButtonProps {
    icon: React.ReactNode;
    count: number;
    label: string;
}

/**
 * InteractionButton - A button for post interactions (comment)
 */
function InteractionButton({ icon, count, label }: InteractionButtonProps) {
    return (
        <button
            className="flex items-center gap-1 border-none px-3 py-2 rounded-full bg-black/10 transition-all duration-200 hover:bg-black/20 hover:shadow-md cursor-pointer"
            title={label}
            aria-label={`${count} ${label}`}
            onClick={() => { }}
            tabIndex={0}
        >
            {icon}
            <span className="text-sm font-medium">{count}</span>
        </button>
    );
} 