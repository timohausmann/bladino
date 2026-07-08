import { CreateAddAttachment } from '@/components/create/CreateAddAttachment';
import { CreateAddEmoji } from '@/components/create/CreateAddEmoji';
import {
  useCommentComposer,
  type UseCommentComposerOptions,
} from '@/components/post/useCommentComposer';
import { Button } from '@/components/ui/button';
import { FilePreview } from '@/components/ui/FilePreview';
import { Textarea } from '@/components/ui/Textarea';
import { MAX_COMMENT_FILES } from '@/utils/postFileUtils';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

const REPLY_TEXTAREA_COMPACT_CLASS =
  'min-h-6 max-h-[400px] overflow-y-auto rounded-none bg-inset p-0 text-[15px] leading-6';
const REPLY_TEXTAREA_ACTIVE_CLASS =
  'min-h-14 max-h-[400px] overflow-y-auto px-3 py-3 text-base leading-normal dark:bg-neutral-900';

/** Paperclip always visible; emoji picker from md breakpoint. */
const COMPOSER_END_ADORNMENT_SLOTS = { base: 1, md: 2 } as const;

export interface CommentComposerFormProps extends UseCommentComposerOptions {
  layout: 'card' | 'reply';
  placeholder?: string;
  submitLabel?: string;
  showCancel?: boolean;
  onCancel?: () => void;
  /** Rendered on the left of the card footer row (e.g. channel picker). */
  leadingActions?: React.ReactNode;
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
  leadingActions,
}: CommentComposerFormProps) {
  const { t } = useTranslation();
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
  const [replyFocused, setReplyFocused] = useState(false);
  const resolvedPlaceholder = placeholder ?? t('posts:composerPlaceholder');
  const resolvedSubmitLabel =
    submitLabel ?? (mode === 'edit' ? t('common:save') : t('posts:publish'));
  const showReplySend =
    replyFocused ||
    composer.content.trim().length > 0 ||
    composer.files.length > 0;
  const replyActive = replyFocused || composer.content.length > 0;

  const inlineActions = (
    <>
      <span className="hidden md:contents">
        <CreateAddEmoji
          onEmojiSelect={composer.handleEmojiSelect}
          shape="soft"
        />
      </span>
      <CreateAddAttachment
        onAddFiles={composer.handleAddFilesClick}
        disabled={composer.isSubmitting}
        shape="soft"
      />
    </>
  );

  const textarea = (
    <Textarea
      value={composer.content}
      onChange={composer.setContent}
      placeholder={resolvedPlaceholder}
      rows={1}
      autoGrow={!isReply || replyActive}
      resize={isReply ? 'resize-none' : undefined}
      endAdornmentReveal={isReply ? 'focus-or-filled' : 'always'}
      wrapperClassName={isReply ? 'min-w-0 flex-1' : undefined}
      className={
        isReply
          ? replyActive
            ? REPLY_TEXTAREA_ACTIVE_CLASS
            : REPLY_TEXTAREA_COMPACT_CLASS
          : 'max-h-[400px] min-h-[82px] overflow-y-auto py-3 leading-normal'
      }
      endAdornment={inlineActions}
      endAdornmentSlotCounts={COMPOSER_END_ADORNMENT_SLOTS}
      disabled={composer.isSubmitting}
      onFocus={isReply ? () => setReplyFocused(true) : undefined}
      onBlur={isReply ? () => setReplyFocused(false) : undefined}
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

  const formSubmit = (
    <Button
      disabled={!composer.canSubmit}
      type="submit"
      variant="primary"
      loading={composer.isSubmitting}
    >
      {resolvedSubmitLabel}
    </Button>
  );

  const replySend = (
    <Button
      type="submit"
      variant="secondary"
      effect="none"
      disabled={!composer.canSubmit}
      loading={composer.isSubmitting}
      aria-label={resolvedSubmitLabel}
      className="h-10 w-10 shrink-0 !rounded-full !p-0"
      iconBefore={<Send size={18} />}
    >
      <span className="sr-only">{resolvedSubmitLabel}</span>
    </Button>
  );

  const cancelButton = showCancel ? (
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
  ) : null;

  return (
    <form onSubmit={composer.handleSubmit} className="flex flex-col gap-2">
      {isReply ? (
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex min-w-0 items-start gap-2">
            {textarea}
            {mode === 'create' ? (
              <div
                className={twMerge(
                  'shrink-0 overflow-hidden transition-all duration-200',
                  showReplySend ? 'h-10 w-10 opacity-100' : 'h-0 w-0 opacity-0',
                )}
              >
                {replySend}
              </div>
            ) : null}
          </div>
          {attachments}
          {mode === 'edit' && (
            <div className="flex items-center justify-end gap-2">
              {cancelButton}
              {formSubmit}
            </div>
          )}
        </div>
      ) : (
        <>
          {textarea}
          {attachments}
        </>
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

      {!isReply && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center">{leadingActions}</div>
          <div className="flex shrink-0 items-center gap-2">
            {cancelButton}
            {formSubmit}
          </div>
        </div>
      )}
    </form>
  );
}
