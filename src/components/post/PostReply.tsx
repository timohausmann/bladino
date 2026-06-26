import { CommentComposerForm } from "@/components/post/CommentComposerForm";

export interface PostReplyProps {
    parentId: string;
    channel?: string;
    placeholder?: string;
    onSuccess?: () => void;
}

/**
 * PostReply - Form component for replying to posts
 */
export function PostReply({
    parentId,
    channel,
    placeholder = "Write a reply...",
    onSuccess,
}: PostReplyProps) {
    return (
        <CommentComposerForm
            mode="create"
            layout="reply"
            parent={parentId}
            channel={channel}
            placeholder={placeholder}
            submitLabel="Reply"
            onSuccess={onSuccess}
            errorMessage="Failed to post reply"
        />
    );
}
