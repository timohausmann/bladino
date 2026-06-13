import { PostFile } from '@/types';
import { fileToPostFile, revokeBlobUrl } from '@/utils/postFileUtils';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/Textarea';
import { FilePreview } from '@/components/ui/FilePreview';
import { CreateAddEmoji } from '@/components/create/CreateAddEmoji';
import { CreateAddMore } from '@/components/create/CreateAddMore';

interface EditPostFormProps {
    initialContent: string;
    initialFiles?: PostFile[];
    onSave: (content: string, files: PostFile[]) => void;
    onCancel: () => void;
    /** When false, only text can be edited (e.g. comments) */
    allowFiles?: boolean;
    saveLabel?: string;
}

/**
 * EditPostForm - Inline form for editing post or comment content
 */
export function EditPostForm({
    initialContent,
    initialFiles = [],
    onSave,
    onCancel,
    allowFiles = true,
    saveLabel = 'Save',
}: EditPostFormProps) {
    const [content, setContent] = useState(initialContent);
    const [files, setFiles] = useState<PostFile[]>(() => [...initialFiles]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const canSave = content.trim().length > 0 || files.length > 0;

    const handleAddFilesClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles?.length) return;

        const newFiles = Array.from(selectedFiles).map(fileToPostFile);
        setFiles(prev => [...prev, ...newFiles]);
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
            }
            return prev + ' ' + emoji;
        });
    };

    const handleCancel = () => {
        // Revoke blob URLs for newly added files that won't be saved
        const initialIds = new Set(initialFiles.map(f => f.id));
        files.forEach(f => {
            if (!initialIds.has(f.id)) revokeBlobUrl(f.url);
        });
        onCancel();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSave) return;
        onSave(content.trim(), files);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Textarea
                value={content}
                onChange={setContent}
                placeholder="What's happening?"
                rows={allowFiles ? 2 : 2}
                resize="resize-y"
                className={allowFiles ? 'min-h-[82px] max-h-[400px]' : 'min-h-14'}
            />

            {allowFiles && files.length > 0 && (
                <FilePreview files={files} onRemove={handleRemoveFile} />
            )}

            {allowFiles && (
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
            )}

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <CreateAddEmoji onEmojiSelect={handleEmojiSelect} />
                    {allowFiles && <CreateAddMore onAddFiles={handleAddFilesClick} />}
                </div>

                <div className="flex gap-2">
                    <Button type="button" onClick={handleCancel} variant="secondary" appearance="outline">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!canSave} variant="primary">
                        {saveLabel}
                    </Button>
                </div>
            </div>
        </form>
    );
}
