import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PostActionButton } from '@/components/post/PostActionButton';
import clsx from 'clsx';

interface PostVoteButtonProps {
  liked: boolean;
  count: number;
  pending: boolean;
  onToggle: () => void;
  variant?: 'default' | 'compact';
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

/**
 * PostVoteButton - presentational heart button for post/reply votes.
 */
export function PostVoteButton({
  liked,
  count,
  pending,
  onToggle,
  variant = 'default',
}: PostVoteButtonProps) {
  const { t } = useTranslation();
  const [burst, setBurst] = useState(false);

  const handleClick = async () => {
    if (pending) {
      return;
    }

    if (!liked) {
      setBurst(true);
    }

    onToggle();
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        aria-label={liked ? t('posts:unlikePost') : t('posts:likePost')}
        className={clsx(
          'text-muted-foreground hover:text-foreground flex h-8 cursor-pointer items-center gap-1.5 rounded-full border-none bg-transparent px-0 transition-colors',
          pending && 'opacity-60',
        )}
        onClick={() => void handleClick()}
      >
        <VoteHeartIcon
          hasVoted={liked}
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
          hasVoted={liked}
          burst={burst}
          onBurstEnd={() => setBurst(false)}
        />
      }
      count={count}
      hideCount={count === 0}
      label={liked ? t('posts:unlikePost') : t('posts:likePost')}
      className="hover:bg-black/5 hover:shadow-none dark:hover:bg-black/10"
      onClick={() => void handleClick()}
    />
  );
}
