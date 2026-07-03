import { CreatePostChannelField } from '@/components/create/CreatePostChannelField';
import { CommentComposerForm } from '@/components/post/CommentComposerForm';
import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';

export interface CreatePostProps {
  /** When set, posts are created in this channel (no picker shown). */
  channel?: string;
  parent?: string;
}

/**
 * CreatePost component
 */
export function CreatePost({ channel, parent }: CreatePostProps) {
  const { t } = useTranslation();
  const [selectedChannel, setSelectedChannel] = useState<string | undefined>();
  const effectiveChannel = channel ?? selectedChannel;

  return (
    <Card
      className={clsx(
        'overflow-hidden transition-all duration-300 ease-in-out',
        'opacity-100',
      )}
    >
      <CommentComposerForm
        mode="create"
        layout="card"
        channel={effectiveChannel}
        parent={parent}
        submitLabel={t('posts:publish')}
        errorMessage={t('errors:publishFailed')}
        beforeSubmit={
          channel ? undefined : (
            <CreatePostChannelField
              value={selectedChannel}
              onValueChange={setSelectedChannel}
            />
          )
        }
      />
    </Card>
  );
}
