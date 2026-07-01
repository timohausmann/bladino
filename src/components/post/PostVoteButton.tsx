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
import { PostActionButton } from '@/components/post/PostActionButton';
import { toast } from '@/components/ui/toast';
import clsx from 'clsx';

interface PostVoteButtonProps {
  comment: Pick<Comment, 'id' | 'voteNum' | 'votes' | 'parent'>;
}

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

/**
 * PostVoteButton - Heart button to like/unlike a post or reply
 */
export function PostVoteButton({ comment }: PostVoteButtonProps) {
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

    const isLiking = !hasVoted;
    if (isLiking) {
      setBurst(true);
    }

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
        (error instanceof Error ? error.message : 'Failed to update like');
      toast(message);
    }
  };

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
      label={hasVoted ? 'Unlike post' : 'Like post'}
      className="hover:bg-black/5 hover:shadow-none dark:hover:bg-black/10"
      onClick={() => void handleClick()}
    />
  );
}
