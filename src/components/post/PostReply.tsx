import { CommentComposerForm } from '@/components/post/CommentComposerForm';
import { useTranslation } from 'react-i18next';

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
  placeholder,
  onSuccess,
}: PostReplyProps) {
  const { t } = useTranslation();

  return (
    <CommentComposerForm
      mode="create"
      layout="reply"
      parent={parentId}
      channel={channel}
      placeholder={placeholder ?? t('posts:replyPlaceholder')}
      submitLabel={t('posts:reply')}
      onSuccess={onSuccess}
      errorMessage={t('errors:replyFailed')}
    />
  );
}
