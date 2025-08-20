import { useUserStore } from '@/stores/userStore';
import { useState } from 'react';
import { Button, Textarea } from '../form';
import { Avatar } from './Avatar';

interface PostReplyProps {
    onSubmit: (content: string) => void;
    onCancel: () => void;
    placeholder?: string;
    maxLength?: number;
}

/**
 * PostReply - Form component for replying to posts
 */
export function PostReply({
    onSubmit,
    placeholder = "Write a reply...",
    maxLength = 280,
}: PostReplyProps) {
    const [content, setContent] = useState('');
    const { currentUser } = useUserStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onSubmit(content.trim());
            setContent('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex gap-3">
                {currentUser?.avatar && (
                    <Avatar
                        src={currentUser.avatar}
                        alt="Your avatar"
                        className="w-10 h-10 flex-shrink-0 mt-2"
                    />
                )}
                <div className="flex-1">
                    <Textarea
                        value={content}
                        onChange={setContent}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        rows={1}
                        resize="resize-y"
                        className="min-h-14"
                    />
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    {content.length}/{maxLength}
                </div>
                <div className="flex gap-2">
                    <Button
                        disabled={content.trim().length === 0}
                        type="submit"
                    >
                        Reply
                    </Button>
                </div>
            </div>
        </form>
    );
}
