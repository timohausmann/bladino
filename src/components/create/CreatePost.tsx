import { PostFile } from '@/types';
import { fileToPostFile, revokeBlobUrl } from '@/utils/postFileUtils';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { FilePreview } from '@/components/ui/FilePreview';
import { CreateAddEmoji } from '@/components/create/CreateAddEmoji';
import { CreateAddMore } from '@/components/create/CreateAddMore';

/**
 * CreatePost component
 */

export function CreatePost() {
    const [content, setContent] = useState('');
    const [files, setFiles] = useState<PostFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Creating post:', { content, files });
        // TODO: Implement post creation logic
        setContent(''); // Clear content after submission
    };

    const handleAddFilesClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles?.length) return;

        const newFiles = Array.from(selectedFiles).map(fileToPostFile);
        setFiles(prev => [...prev, ...newFiles]);

        // Reset so the same file can be selected again
        e.target.value = '';
    };

    const handleRemoveFile = (fileId: string) => {
        setFiles(prev => {
            const removed = prev.find(f => f.id === fileId);
            if (removed) revokeBlobUrl(removed.url);
            return prev.filter(f => f.id !== fileId);
        });
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
    const canPublish = content.trim().length > 0 || files.length > 0;

    return (
        <Card className={clsx(
            'transition-all duration-300 ease-in-out overflow-hidden',
            'opacity-100'
        )}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                {/* Main text input */}
                <Textarea
                    value={content}
                    onChange={setContent}
                    placeholder="What's happening?"
                    rows={2}
                    resize="resize-y"
                    className="min-h-[82px] max-h-[400px]"
                />

                {files.length > 0 && (
                    <FilePreview files={files} onRemove={handleRemoveFile} />
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                    aria-hidden
                    tabIndex={-1}
                />

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <CreateAddEmoji onEmojiSelect={handleEmojiSelect} />
                        <CreateAddMore onAddFiles={handleAddFilesClick} />
                    </div>

                    <Button
                        disabled={!canPublish}
                        type="submit"
                        variant="primary"
                    >
                        Publish
                    </Button>
                </div>
            </form>
        </Card>
    );
}
