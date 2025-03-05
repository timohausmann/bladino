import React from 'react';
import { Heart, MessageCircle, Share2 } from 'react-feather';
import * as Dialog from '@radix-ui/react-dialog';

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
    return (
        <div
            style={{
                borderRadius: '12px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--card)',
                color: 'var(--card-foreground)',
                padding: '1rem',
                marginBottom: '1rem',
                maxWidth: '100%',
                overflow: 'hidden',
            }}
        >
            {/* User info and timestamp */}
            <div style={{ display: 'flex', marginBottom: '0.75rem' }}>
                <div
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        marginRight: '12px',
                    }}
                >
                    <img
                        src={avatar}
                        alt={`${name}'s avatar`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <h3 style={{ fontWeight: 'bold', marginBottom: '2px' }}>{name}</h3>
                            <span style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
                                @{handle}
                            </span>
                        </div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
                            {timestamp}
                        </div>
                    </div>
                </div>
            </div>

            {/* Post content */}
            <Dialog.Root>
                <Dialog.Trigger asChild>
                    <div
                        style={{
                            marginBottom: '1rem',
                            cursor: 'pointer',
                            fontSize: '17px',
                            lineHeight: '1.4'
                        }}
                    >
                        <p>{content}</p>
                    </div>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.45)',
                        animation: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                        zIndex: 50
                    }} />
                    <Dialog.Content style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        minWidth: '90%',
                        maxWidth: '500px',
                        maxHeight: '85vh',
                        padding: '24px',
                        backgroundColor: 'var(--background)',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                        zIndex: 51,
                        overflowY: 'auto'
                    }}>
                        <div style={{
                            display: 'flex',
                            marginBottom: '12px',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <img
                                src={avatar}
                                alt={`${name}'s avatar`}
                                style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                            />
                            <div>
                                <h3 style={{ fontWeight: 'bold' }}>{name}</h3>
                                <span style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>@{handle}</span>
                            </div>
                        </div>
                        <p style={{ fontSize: '18px', lineHeight: '1.5', marginBottom: '20px' }}>{content}</p>
                        <div style={{ color: 'var(--muted-foreground)', marginBottom: '12px' }}>{timestamp}</div>
                        <Dialog.Close asChild>
                            <button style={{
                                border: 'none',
                                borderRadius: '4px',
                                padding: '8px 12px',
                                backgroundColor: 'var(--muted)',
                                color: 'var(--foreground)',
                                cursor: 'pointer'
                            }}>Close</button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Interaction buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                color: 'var(--muted-foreground)',
                cursor: 'pointer',
                transition: 'color 0.2s, background-color 0.2s',
            }}
            title={label}
            aria-label={`${count} ${label}`}
            onClick={() => { }}
        >
            {icon}
            <span>{count}</span>
        </button>
    );
} 