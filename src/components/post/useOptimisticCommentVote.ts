import type { Comment, CommentFeedQuery, CommentQuery } from '@/graphql';
import {
  ToggleVoteDocument,
  getGraphQLErrorMessage,
  useGraphQLMutation,
} from '@/graphql';
import { useUserStore } from '@/stores/userStore';
import { toast } from '@/components/ui/toast';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

type VoteUser = {
  id: string;
  name: string;
  avatar?: string | null;
};

type VoteEntry = {
  id?: string | null;
  user?: VoteUser | null;
};

type VotableRecord = {
  id?: string | number | null;
  voteNum?: number | null;
  votes?: Array<VoteEntry | null> | null;
};

type VotableComment = VotableRecord & {
  children?: Array<VotableRecord | null> | null;
};

interface UseOptimisticCommentVoteOptions {
  comment: Pick<Comment, 'id' | 'voteNum' | 'votes' | 'parent'>;
}

function hasCurrentUserVoted(
  votes: Comment['votes'],
  currentUserId: string | undefined,
): boolean {
  if (!currentUserId) {
    return false;
  }

  return (votes ?? []).some((vote) => vote?.user?.id === currentUserId);
}

function applyVoteChange<T extends VotableRecord>(
  item: T,
  isLiking: boolean,
  user: VoteUser,
): T {
  const votes = item.votes ?? [];
  const hasVote = votes.some((vote) => vote?.user?.id === user.id);

  if ((isLiking && hasVote) || (!isLiking && !hasVote)) {
    return item;
  }

  const nextVotes = isLiking
    ? [{ id: `optimistic-${user.id}`, user }, ...votes]
    : votes.filter((vote) => vote?.user?.id !== user.id);
  const currentVoteNum = item.voteNum ?? votes.length;

  return {
    ...item,
    voteNum: Math.max(0, currentVoteNum + (isLiking ? 1 : -1)),
    votes: nextVotes,
  };
}

function updateComment(
  comment: VotableComment,
  targetId: string,
  isLiking: boolean,
  user: VoteUser,
): VotableComment {
  if (String(comment.id ?? '') === targetId) {
    return applyVoteChange(comment, isLiking, user);
  }

  if (!comment.children) {
    return comment;
  }

  return {
    ...comment,
    children: comment.children.map((child) =>
      child && String(child.id ?? '') === targetId
        ? applyVoteChange(child, isLiking, user)
        : child,
    ),
  };
}

function updateCommentList<T extends VotableComment>(
  comments: Array<T | null>,
  targetId: string,
  isLiking: boolean,
  user: VoteUser,
): Array<T | null> {
  return comments.map((comment) =>
    comment ? (updateComment(comment, targetId, isLiking, user) as T) : comment,
  );
}

/**
 * Handles vote toggling and immediate cache updates for comments/posts.
 */
export function useOptimisticCommentVote({
  comment,
}: UseOptimisticCommentVoteOptions) {
  const { t } = useTranslation();
  const currentUser = useUserStore((store) => store.currentUser);
  const queryClient = useQueryClient();
  const { mutateAsync: toggleVote, isPending } =
    useGraphQLMutation(ToggleVoteDocument);

  const liked = hasCurrentUserVoted(comment.votes, currentUser?.id);
  const count = comment.voteNum ?? 0;

  const toggle = async () => {
    if (isPending || !currentUser) {
      return;
    }

    const isLiking = !liked;
    const optimisticUser = {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
    };

    const targetId = String(comment.id);

    queryClient.setQueriesData<CommentFeedQuery>(
      { queryKey: ['CommentFeed'] },
      (oldData) =>
        oldData?.commentFeed
          ? {
              ...oldData,
              commentFeed: {
                ...oldData.commentFeed,
                comments: updateCommentList(
                  oldData.commentFeed.comments,
                  targetId,
                  isLiking,
                  optimisticUser,
                ),
              },
            }
          : oldData,
    );
    queryClient.setQueriesData<CommentQuery>(
      { queryKey: ['Comment'] },
      (oldData) =>
        oldData?.comment
          ? {
              ...oldData,
              comment: updateComment(
                oldData.comment,
                targetId,
                isLiking,
                optimisticUser,
              ) as CommentQuery['comment'],
            }
          : oldData,
    );

    try {
      await toggleVote({ post: comment.id });

      await queryClient.invalidateQueries({ queryKey: ['CommentFeed'] });
      await queryClient.invalidateQueries({
        queryKey: ['Comment', { id: comment.id }],
      });

      if (comment.parent) {
        await queryClient.invalidateQueries({
          queryKey: ['Comment', { id: comment.parent }],
        });
      }
    } catch (error) {
      const message =
        getGraphQLErrorMessage(error) ??
        (error instanceof Error ? error.message : t('errors:likeFailed'));
      toast(message);
      await queryClient.invalidateQueries({ queryKey: ['CommentFeed'] });
      await queryClient.invalidateQueries({
        queryKey: ['Comment', { id: comment.id }],
      });
    }
  };

  return {
    liked,
    count,
    pending: isPending,
    toggle,
  };
}
