import clsx from 'clsx';
import { useState } from 'react';
import { Button, Textarea } from '../form';
import { Card } from '../ui/Card';
import { CreateAddEmoji } from './CreateAddEmoji';
import { CreateAddMore } from './CreateAddMore';

/**
 * CreatePost component
 */
export function CreatePost() {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Creating post:', { content });
        // TODO: Implement post creation logic
        setContent(''); // Clear content after submission
    };

    const handleEmojiSelect = (emoji: string) => {
        setContent(prev => {
            if (!prev.length || prev.slice(-1) === ' ') {
                return prev + emoji;
            } else {
                return prev + ' ' + emoji;
            }
        });
    };

    // Check if post can be published (has text or other content)
    const canPublish = content.trim().length > 0;

    return (
        <Card className={clsx(
            'transition-all duration-300 ease-in-out overflow-hidden',
            'max-h-[400px] opacity-100'
        )}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Main text input */}
                <Textarea
                    value={content}
                    onChange={setContent}
                    placeholder="What's happening?"
                    rows={2}
                    resize="resize-y"
                    className="min-h-[82px]"
                />

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <CreateAddEmoji onEmojiSelect={handleEmojiSelect} />
                        <CreateAddMore />
                    </div>

                    <Button
                        disabled={!canPublish}
                        type="submit"
                    >
                        Publish
                    </Button>
                </div>
            </form>
        </Card>
    );
}
