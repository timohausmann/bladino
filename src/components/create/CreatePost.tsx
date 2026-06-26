import {
    fileToLocalDraft,
    MAX_COMMENT_FILES,
    revokeBlobUrl,
    revokeDraftFiles,
    type LocalDraftFile,
} from '@/utils/postFileUtils';
import { uploadFiles } from '@/utils/uploadFile';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { FilePreview } from '@/components/ui/FilePreview';
import { CreateAddEmoji } from '@/components/create/CreateAddEmoji';
import { CreateAddMore } from '@/components/create/CreateAddMore';
import { toast } from '@/components/ui/toast';
import {
    AddCommentDocument,
    getGraphQLErrorMessage,
    useGraphQLMutation,
} from '@/graphql';

export interface CreatePostProps {
    channel?: string;
    parent?: string;
}

/**
 * CreatePost component
 */
export function CreatePost({ channel, parent }: CreatePostProps) {
    const [content, setContent] = useState('');
    const [files, setFiles] = useState<LocalDraftFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    const { mutateAsync: addComment } = useGraphQLMutation(AddCommentDocument);

    const trimmedContent = content.trim();
    const canPublish =
        (trimmedContent.length > 0 || files.length > 0) && !isSubmitting;
    const atFileLimit = files.length >= MAX_COMMENT_FILES;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canPublish) return;

        setIsSubmitting(true);

        try {
            const fileIds =
                files.length > 0
                    ? await uploadFiles(
                        files.map((draft) => draft.file),
                        { channel, parent },
                    )
                    : [];

            await addComment({
                body: trimmedContent || undefined,
                channel: channel ?? undefined,
                files: fileIds.length > 0 ? fileIds : undefined,
                parent: parent ?? undefined,
            });

            revokeDraftFiles(files);
            setContent('');
            setFiles([]);
            await queryClient.invalidateQueries({ queryKey: ['CommentFeed'] });
        } catch (error) {
            const message =
                getGraphQLErrorMessage(error) ??
                (error instanceof Error ? error.message : 'Failed to publish post');
            toast(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddFilesClick = () => {
        if (atFileLimit) {
            toast(`You can only attach up to ${MAX_COMMENT_FILES} files.`);
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles?.length) return;

        const newFiles = Array.from(selectedFiles).map(fileToLocalDraft);
        const room = MAX_COMMENT_FILES - files.length;

        if (room <= 0) {
            toast(`You can only attach up to ${MAX_COMMENT_FILES} files.`);
            revokeDraftFiles(newFiles);
            e.target.value = '';
            return;
        }

        const accepted = newFiles.slice(0, room);
        const rejected = newFiles.slice(room);

        if (rejected.length > 0) {
            toast(`You can only attach up to ${MAX_COMMENT_FILES} files.`);
            revokeDraftFiles(rejected);
        }

        setFiles((prev) => [...prev, ...accepted]);

        // Reset so the same file can be selected again
        e.target.value = '';
    };

    const handleRemoveFile = (fileId: string) => {
        setFiles((prev) => {
            const removed = prev.find((f) => f.id === fileId);
            if (removed) revokeBlobUrl(removed.url);
            return prev.filter((f) => f.id !== fileId);
        });
    };

    const handleEmojiSelect = (emoji: string) => {
        setContent((prev) => {
            if (!prev.length || prev.slice(-1) === ' ') {
                return prev + emoji;
            } else {
                return prev + ' ' + emoji;
            }
        });
    };

    return (
        <Card
            className={clsx(
                'transition-all duration-300 ease-in-out overflow-hidden',
                'opacity-100',
            )}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                {/* Main text input */}
                <Textarea
                    value={content}
                    onChange={setContent}
                    placeholder="What's happening?"
                    rows={2}
                    resize="resize-y"
                    className="min-h-[82px] max-h-[400px]"
                    disabled={isSubmitting}
                />

                {files.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <p className="text-xs tracking-wider uppercase text-muted-foreground">
                            Attachments ({files.length}/{MAX_COMMENT_FILES})
                        </p>
                        <FilePreview files={files} onRemove={handleRemoveFile} />
                    </div>
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
                    disabled={isSubmitting}
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
                        loading={isSubmitting}
                    >
                        Publish
                    </Button>
                </div>
            </form>
        </Card>
    );
}
