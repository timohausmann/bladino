import { PostCard } from '@/components/post/PostCard';
import { ResourceError } from '@/components/ui/ResourceError';
import { ResourceNotFound } from '@/components/ui/ResourceNotFound';
import {
  CommentDocument,
  getGraphQLErrorMessage,
  useGraphQLQuery,
  type Comment,
} from '@/graphql';
import { useParams } from '@tanstack/react-router';

/**
 * PostDetail page - displays a single post by ID
 */
export function PostDetail() {
  const { id } = useParams({ from: '/_authenticated/post/$id' });

  const { data, isPending, isError, error } = useGraphQLQuery(CommentDocument, {
    id,
  });

  if (isPending) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Loading post…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <ResourceError resource="post" message={getGraphQLErrorMessage(error)} />
    );
  }

  const comment = data?.comment;

  if (!comment) {
    return <ResourceNotFound resource="post" />;
  }

  return <PostCard comment={comment as Comment} />;
}
