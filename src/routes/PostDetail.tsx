import { PostCard } from '@/components/post/PostCard';
import { ResourceError } from '@/components/ui/ResourceError';
import { ResourceNotFound } from '@/components/ui/ResourceNotFound';
import {
  CommentDocument,
  getGraphQLErrorMessage,
  useGraphQLQuery,
  type Comment,
} from '@/graphql';
import { getCommentChildren, getCommentDomId } from '@/utils/commentUtils';
import { useMatch, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * PostDetail page - displays a single post by ID, optionally scrolled to a reply.
 */
export function PostDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const postMatch = useMatch({
    from: '/_authenticated/post/$id',
    shouldThrow: false,
  });
  const postCommentMatch = useMatch({
    from: '/_authenticated/post/$id/comment/$commentId',
    shouldThrow: false,
  });
  const id = postCommentMatch?.params.id ?? postMatch?.params.id;
  const highlightCommentId = postCommentMatch?.params.commentId;

  const handleDeleted = () => {
    void navigate({ to: '/feed' });
  };

  const { data, isPending, isError, error } = useGraphQLQuery(
    CommentDocument,
    { id: id ?? '' },
    { enabled: Boolean(id) },
  );

  const comment = data?.comment as Comment | undefined;
  const highlightedCommentExists =
    highlightCommentId !== undefined &&
    comment !== undefined &&
    getCommentChildren(comment).some(
      (child) => child.id === highlightCommentId,
    );

  useEffect(() => {
    if (!highlightCommentId || isPending) return;

    const element = document.getElementById(
      getCommentDomId(highlightCommentId),
    );
    element?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [highlightCommentId, isPending, comment?.id]);

  if (!id) {
    return <ResourceNotFound resource="post" />;
  }

  if (isPending) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{t('posts:loading')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <ResourceError resource="post" message={getGraphQLErrorMessage(error)} />
    );
  }

  if (!comment) {
    return <ResourceNotFound resource="post" />;
  }

  return (
    <PostCard
      comment={comment}
      highlightedCommentId={
        highlightedCommentExists ? highlightCommentId : undefined
      }
      onDeleted={handleDeleted}
    />
  );
}
