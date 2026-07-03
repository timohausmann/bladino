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
import { useTranslation } from 'react-i18next';

export interface CommentComposerFormProps extends UseCommentComposerOptions {
  layout: 'card' | 'reply';
  placeholder?: string;
  submitLabel?: string;
  showCancel?: boolean;
  onCancel?: () => void;
  /** Rendered inline to the left of the submit button. */
  beforeSubmit?: React.ReactNode;
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
  placeholder,
  submitLabel,
  showCancel,
  onCancel,
  onSuccess,
  errorMessage,
  beforeSubmit,
}: CommentComposerFormProps) {
  const { t } = useTranslation();
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
  const resolvedPlaceholder = placeholder ?? t('posts:composerPlaceholder');
  const resolvedSubmitLabel =
    submitLabel ?? (mode === 'edit' ? t('common:save') : t('posts:publish'));

  const textarea = (
    <Textarea
      value={composer.content}
      onChange={composer.setContent}
      placeholder={resolvedPlaceholder}
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
          {t('posts:attachmentsLabel', {
            count: composer.files.length,
            max: MAX_COMMENT_FILES,
          })}
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
            alt={t('common:yourAvatar')}
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

        <div className="flex items-center gap-2">
          {beforeSubmit}
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
              {t('common:cancel')}
            </Button>
          )}
          <Button
            disabled={!composer.canSubmit}
            type="submit"
            variant="primary"
            loading={composer.isSubmitting}
          >
            {resolvedSubmitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
