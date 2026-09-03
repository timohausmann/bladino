import { CreatePostChannelField } from '@/components/create/CreatePostChannelField';
import { CommentComposerForm } from '@/components/post/CommentComposerForm';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
    <Card>
      <CommentComposerForm
        mode="create"
        layout="card"
        channel={effectiveChannel}
        parent={parent}
        submitLabel={t('posts:publish')}
        errorMessage={t('errors:publishFailed')}
        leadingActions={
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
