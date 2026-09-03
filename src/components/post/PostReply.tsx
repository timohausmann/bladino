import { CommentComposerForm } from '@/components/post/CommentComposerForm';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../ui/Avatar';
import { useUserStore } from '@/stores/userStore';

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

  const currentUser = useUserStore((store) => store.currentUser);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex gap-3">
      <Avatar
        avatar={currentUser.avatar}
        alt={currentUser.name}
        className="mt-0.5 h-6 w-6 shrink-0"
      />
      <div className="min-w-0 flex-1 pt-0.5">
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
      </div>
    </div>
  );
}
