import React, { useMemo } from 'react';
import { Heart, MessageCircle, Share2 } from 'react-feather';
import * as Dialog from '@radix-ui/react-dialog';
import { parseTextWithLinks, extractFirstUrl } from '../../utils/textUtils';
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
        <div className="rounded-xl border border-border bg-card text-card-foreground p-4 mb-4 max-w-full overflow-hidden">
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

            {/* Post content */}
            <Dialog.Root>
                <Dialog.Trigger asChild>
                    <div className="mb-2 cursor-pointer text-[17px] leading-relaxed">
                        <p>{parsedContent}</p>
                    </div>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/45 animate-in fade-in-0 z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] max-h-[85vh] p-6 bg-background rounded-lg shadow-lg z-50 overflow-y-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src={avatar}
                                alt={`${name}'s avatar`}
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <h3 className="font-bold">{name}</h3>
                                <span className="text-muted-foreground text-sm">@{handle}</span>
                            </div>
                        </div>
                        <p className="text-lg leading-relaxed mb-5">{parsedContent}</p>
                        {firstUrl && (
                            <div className="mb-5">
                                <LinkPreview url={firstUrl} />
                            </div>
                        )}
                        <div className="text-muted-foreground mb-3">{timestamp}</div>
                        <Dialog.Close asChild>
                            <button className="border-none rounded bg-muted text-foreground py-2 px-3 cursor-pointer">
                                Close
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

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