import { CommentComposerForm } from '@/components/post/CommentComposerForm';
import clsx from 'clsx';
import { Card } from '@/components/ui/Card';

export interface CreatePostProps {
  channel?: string;
  parent?: string;
}

/**
 * CreatePost component
 */
export function CreatePost({ channel, parent }: CreatePostProps) {
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
        channel={channel}
        parent={parent}
        submitLabel="Publish"
        errorMessage="Failed to publish post"
      />
    </Card>
  );
}
