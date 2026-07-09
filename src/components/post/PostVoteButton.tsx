import type { Comment } from '@/graphql';
import {
  ToggleVoteDocument,
  getGraphQLErrorMessage,
  useGraphQLMutation,
} from '@/graphql';
import { useUserStore } from '@/stores/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PostActionButton } from '@/components/post/PostActionButton';
import { toast } from '@/components/ui/toast';
import clsx from 'clsx';

interface PostVoteButtonProps {
  comment: Pick<Comment, 'id' | 'voteNum' | 'votes' | 'parent'>;
  variant?: 'default' | 'compact';
}

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
  [key: string]: unknown;
};

interface VoteHeartIconProps {
  hasVoted: boolean;
  burst: boolean;
  onBurstEnd: () => void;
}

function VoteHeartIcon({ hasVoted, burst, onBurstEnd }: VoteHeartIconProps) {
  return (
    <span className="relative inline-flex size-4.5 items-center justify-center overflow-visible">
      <Heart
        size={18}
        className={clsx(
          'transition-colors duration-300',
          hasVoted
            ? 'fill-red-500 text-red-500'
            : 'fill-transparent text-current',
        )}
      />
      {burst ? (
        <Heart
          size={18}
          aria-hidden
          onAnimationEnd={onBurstEnd}
          className="pointer-events-none absolute inset-0 animate-[heart-burst_600ms_ease-out_forwards] fill-red-500 text-red-500"
        />
      ) : null}
    </span>
  );
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function updateVoteFields(
  value: VotableRecord,
  isLiking: boolean,
  user: VoteUser,
): VotableRecord {
  const votes = value.votes ?? [];
  const hasVote = votes.some((vote) => vote?.user?.id === user.id);

  if (isLiking && hasVote) {
    return value;
  }

  if (!isLiking && !hasVote) {
    return value;
  }

  const nextVotes = isLiking
    ? [{ id: `optimistic-${user.id}`, user }, ...votes]
    : votes.filter((vote) => vote?.user?.id !== user.id);
  const currentVoteNum = value.voteNum ?? votes.length;

  return {
    ...value,
    voteNum: Math.max(0, currentVoteNum + (isLiking ? 1 : -1)),
    votes: nextVotes,
  };
}

function updateCommentVoteInTree(
  value: unknown,
  targetId: string,
  isLiking: boolean,
  user: VoteUser,
): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) =>
      updateCommentVoteInTree(entry, targetId, isLiking, user),
    );
  }

  if (!isRecord(value)) {
    return value;
  }

  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    next[key] = updateCommentVoteInTree(child, targetId, isLiking, user);
  }

  if (
    String(value.id ?? '') === targetId &&
    ('voteNum' in value || 'votes' in value)
  ) {
    return updateVoteFields(next as VotableRecord, isLiking, user);
  }

  return next;
}

/**
 * PostVoteButton - Heart button to like/unlike a post or reply
 */
export function PostVoteButton({
  comment,
  variant = 'default',
}: PostVoteButtonProps) {
  const { t } = useTranslation();
  const currentUser = useUserStore((store) => store.currentUser);
  const queryClient = useQueryClient();
  const { mutateAsync: toggleVote, isPending } =
    useGraphQLMutation(ToggleVoteDocument);
  const [burst, setBurst] = useState(false);

  const voteCount = comment.voteNum ?? 0;
  const hasVoted = hasCurrentUserVoted(comment.votes, currentUser?.id);

  const handleClick = async () => {
    if (isPending) {
      return;
    }

    if (!currentUser) {
      return;
    }

    const isLiking = !hasVoted;
    if (isLiking) {
      setBurst(true);
    }

    const optimisticUser = {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
    };

    queryClient.setQueriesData({ queryKey: ['CommentFeed'] }, (oldData) =>
      updateCommentVoteInTree(
        oldData,
        String(comment.id),
        isLiking,
        optimisticUser,
      ),
    );
    queryClient.setQueriesData({ queryKey: ['Comment'] }, (oldData) =>
      updateCommentVoteInTree(
        oldData,
        String(comment.id),
        isLiking,
        optimisticUser,
      ),
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

  if (variant === 'compact') {
    return (
      <button
        type="button"
        aria-label={hasVoted ? t('posts:unlikePost') : t('posts:likePost')}
        className={clsx(
          'text-muted-foreground hover:text-foreground flex h-8 cursor-pointer items-center gap-1.5 rounded-full border-none bg-transparent px-0 transition-colors',
          isPending && 'opacity-60',
        )}
        onClick={() => void handleClick()}
      >
        <VoteHeartIcon
          hasVoted={hasVoted}
          burst={burst}
          onBurstEnd={() => setBurst(false)}
        />
      </button>
    );
  }

  return (
    <PostActionButton
      icon={
        <VoteHeartIcon
          hasVoted={hasVoted}
          burst={burst}
          onBurstEnd={() => setBurst(false)}
        />
      }
      count={voteCount}
      hideCount={voteCount === 0}
      label={hasVoted ? t('posts:unlikePost') : t('posts:likePost')}
      className="hover:bg-black/5 hover:shadow-none dark:hover:bg-black/10"
      onClick={() => void handleClick()}
    />
  );
}
