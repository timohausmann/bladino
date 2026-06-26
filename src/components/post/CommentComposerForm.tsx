import { CreateAddEmoji } from '@/components/create/CreateAddEmoji';
import { CreateAddMore } from '@/components/create/CreateAddMore';
import {
  useCommentComposer,
  type UseCommentComposerOptions,
} from '@/components/post/useCommentComposer';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/button';
import { FilePreview } from '@/components/ui/FilePreview';
import { Textarea } from '@/components/ui/Textarea';
import { useUserStore } from '@/stores/userStore';
import { MAX_COMMENT_FILES } from '@/utils/postFileUtils';

export interface CommentComposerFormProps extends UseCommentComposerOptions {
  layout: 'card' | 'reply';
  placeholder?: string;
  submitLabel?: string;
  showCancel?: boolean;
  onCancel?: () => void;
}

/**
 * Shared composer for creating/editing posts and replies.
 */
export function CommentComposerForm({
  mode,
  layout,
  commentId,
  channel,
  parent,
  initialContent,
  initialFiles,
  placeholder = "What's happening?",
  submitLabel = mode === 'edit' ? 'Save' : 'Publish',
  showCancel,
  onCancel,
  onSuccess,
  errorMessage,
}: CommentComposerFormProps) {
  const currentUser = useUserStore((store) => store.currentUser);
  const composer = useCommentComposer({
    mode,
    commentId,
    channel,
    parent,
    initialContent,
    initialFiles,
    onSuccess,
    errorMessage,
  });

  const isReply = layout === 'reply';

  const textarea = (
    <Textarea
      value={composer.content}
      onChange={composer.setContent}
      placeholder={placeholder}
      rows={isReply ? 1 : 2}
      resize="resize-y"
      className={isReply ? 'min-h-14' : 'max-h-[400px] min-h-[82px]'}
      disabled={composer.isSubmitting}
    />
  );

  const attachments =
    composer.files.length > 0 ? (
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs tracking-wide uppercase">
          Attachments ({composer.files.length}/{MAX_COMMENT_FILES})
        </p>
        <FilePreview
          files={composer.files}
          onRemove={composer.handleRemoveFile}
        />
      </div>
    ) : null;

  const mainFields = (
    <>
      {textarea}
      {attachments}
    </>
  );

  return (
    <form onSubmit={composer.handleSubmit} className="flex flex-col gap-2">
      {isReply ? (
        <div className="flex gap-3">
          <Avatar
            avatar={currentUser?.avatar}
            alt={currentUser?.name ?? 'Your avatar'}
            className="mt-2 h-10 w-10 shrink-0"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2">{mainFields}</div>
        </div>
      ) : (
        mainFields
      )}

      <input
        ref={composer.fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={composer.handleFileChange}
        aria-hidden
        tabIndex={-1}
        disabled={composer.isSubmitting}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreateAddEmoji onEmojiSelect={composer.handleEmojiSelect} />
          <CreateAddMore onAddFiles={composer.handleAddFilesClick} />
        </div>

        <div className="flex gap-2">
          {showCancel && (
            <Button
              type="button"
              onClick={() => {
                composer.handleCancel();
                onCancel?.();
              }}
              variant="secondary"
              appearance="outline"
              disabled={composer.isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            disabled={!composer.canSubmit}
            type="submit"
            variant="primary"
            loading={composer.isSubmitting}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
