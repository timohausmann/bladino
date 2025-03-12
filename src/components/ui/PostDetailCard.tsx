import React, { useMemo } from 'react';
import { Heart, MessageCircle, Share2 } from 'react-feather';
import { extractFirstUrl, parseTextWithLinks } from '../../utils/textUtils';
import { LinkPreview } from './LinkPreview';

interface PostDetailCardProps {
    avatar: string;
    name: string;
    handle: string;
    timestamp: string;
    content: string;
    likes: number;
    comments: number;
    shares: number;
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
    likes = 0,
    comments = 0,
    shares = 0
}: PostDetailCardProps) {
    // Parse content for links
    const parsedContent = useMemo(() => parseTextWithLinks(content), [content]);

    // Extract the first URL for link preview
    const firstUrl = useMemo(() => extractFirstUrl(content), [content]);

    return (
        <div className="rounded-xl bg-card text-card-foreground p-4 mb-4 max-w-full overflow-hidden">
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

            <div className="mb-2 text-[17px] leading-relaxed">
                <p>{parsedContent}</p>
            </div>

            {/* Link Preview (if there's a URL in the content) */}
            {firstUrl && <LinkPreview url={firstUrl} />}

            {/* Interaction buttons */}
            <div className="flex justify-between">
                <InteractionButton icon={<Heart size={18} />} count={likes} label="Likes" />
                <InteractionButton icon={<MessageCircle size={18} />} count={comments} label="Comments" />
                <InteractionButton icon={<Share2 size={18} />} count={shares} label="Shares" />
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
 * InteractionButton - A button for post interactions (like, comment, share)
 */
function InteractionButton({ icon, count, label }: InteractionButtonProps) {
    return (
        <button
            className="flex items-center gap-1 bg-transparent border-none px-3 py-2 rounded text-muted-foreground cursor-pointer transition-colors"
            title={label}
            aria-label={`${count} ${label}`}
            onClick={() => { }}
        >
            {icon}
            <span>{count}</span>
        </button>
    );
} 