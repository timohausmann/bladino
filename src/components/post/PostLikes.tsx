import type { Comment } from '@/graphql';
import { useUserStore } from '@/stores/userStore';
import * as Dialog from '@radix-ui/react-dialog';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/Avatar';
import {
  overlayBackdropEnterClassName,
  overlayContentVariants,
} from '@/components/ui/overlay';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { PostVoteButton } from '@/components/post/PostVoteButton';
import { useOptimisticCommentVote } from '@/components/post/useOptimisticCommentVote';

type LikeVote = NonNullable<Comment['votes']>[number];
type LikeUser = NonNullable<NonNullable<LikeVote>['user']>;

interface PostLikesProps {
  comment: Pick<Comment, 'id' | 'voteNum' | 'votes' | 'parent'>;
  variant?: 'default' | 'compact' | 'textOnly';
}

function getDisplayName(
  user: LikeUser,
  currentUserId: string | undefined,
  youLabel: string,
): string {
  return user.id === currentUserId ? youLabel : user.name;
}

function getLikedByText(
  users: LikeUser[],
  currentUserId: string | undefined,
  t: (key: string, options?: Record<string, unknown>) => string,
): string | null {
  if (users.length === 0) {
    return null;
  }

  const youLabel = t('common:youDative');

  if (users.length === 1) {
    return t('posts:likedByOne', {
      name: getDisplayName(users[0], currentUserId, youLabel),
    });
  }

  if (users.length === 2) {
    return t('posts:likedByTwo', {
      name1: getDisplayName(users[0], currentUserId, youLabel),
      name2: getDisplayName(users[1], currentUserId, youLabel),
    });
  }

  return t('posts:likedByMany', {
    name: getDisplayName(users[0], currentUserId, youLabel),
    count: users.length - 1,
  });
}

function getUniqueVoteUsers(
  votes: Comment['votes'],
  currentUserId: string | undefined,
): LikeUser[] {
  const usersById = new Map<string, LikeUser>();

  for (const vote of votes ?? []) {
    const user = vote?.user;
    if (!user || usersById.has(user.id)) {
      continue;
    }

    usersById.set(user.id, user);
  }

  const users = Array.from(usersById.values());

  if (!currentUserId) {
    return users;
  }

  return users.sort((left, right) => {
    if (left.id === currentUserId) {
      return -1;
    }

    if (right.id === currentUserId) {
      return 1;
    }

    return 0;
  });
}

function LikesDialog({
  open,
  onOpenChange,
  users,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: LikeUser[];
}) {
  const { t } = useTranslation();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={clsx(
            overlayBackdropEnterClassName,
            'fixed inset-0 z-50 bg-black/10 backdrop-blur-sm',
          )}
        />
        <Dialog.Content
          className={clsx(
            'fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md',
            overlayContentVariants({
              tone: 'surface',
              motion: 'dialog',
            }),
            '-translate-x-1/2 -translate-y-1/2 p-6 focus:outline-none',
          )}
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <Dialog.Title className="text-foreground text-lg font-semibold">
              {t('posts:likesTitle')}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                aria-label={t('posts:closeLikesDialog')}
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          <ScrollArea
            className="max-h-80 pr-3"
            label={t('posts:likesListLabel')}
          >
            <div className="flex flex-col gap-2">
              {users.map((user) => (
                <Link
                  key={user.id}
                  to="/u/$name"
                  params={{ name: user.name }}
                  className="hover:bg-surface-hover flex items-center gap-3 rounded-xl px-1 py-2 transition-colors"
                >
                  <Avatar
                    avatar={user.avatar}
                    alt={t('common:userAvatar', { name: user.name })}
                    className="h-9 w-9"
                  />
                  <span className="text-foreground text-sm font-medium">
                    {user.name}
                  </span>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * PostLikes - Separated controls for toggling a like vs. viewing all likes.
 */
export function PostLikes({ comment, variant = 'default' }: PostLikesProps) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const currentUser = useUserStore((store) => store.currentUser);
  const currentUserId = currentUser?.id;
  const users = useMemo(
    () => getUniqueVoteUsers(comment.votes, currentUserId),
    [comment.votes, currentUserId],
  );
  const likedByText = getLikedByText(users, currentUserId, t);
  const vote = useOptimisticCommentVote({ comment });

  return (
    <>
      {variant === 'default' ? (
        <div className="flex min-w-0 items-center gap-2">
          {likedByText ? (
            <button
              type="button"
              className={clsx(
                'text-muted-foreground text-sm transition-colors',
                'hover:text-foreground text-left',
              )}
              onClick={() => setDialogOpen(true)}
            >
              {likedByText}
            </button>
          ) : null}
          <PostVoteButton
            liked={vote.liked}
            count={vote.count}
            pending={vote.pending}
            onToggle={() => void vote.toggle()}
          />
        </div>
      ) : variant === 'textOnly' ? (
        likedByText ? (
          <button
            type="button"
            className={clsx(
              'text-muted-foreground hover:text-foreground text-left text-sm transition-colors',
            )}
            onClick={() => setDialogOpen(true)}
          >
            {likedByText}
          </button>
        ) : null
      ) : (
        <div className="flex items-center gap-2">
          {users.length > 0 ? (
            <button
              type="button"
              className={clsx(
                'text-foreground min-w-[0.75rem] text-right text-xs font-semibold transition-colors hover:underline',
              )}
              onClick={() => setDialogOpen(true)}
            >
              {users.length}
            </button>
          ) : null}
          <PostVoteButton
            liked={vote.liked}
            count={vote.count}
            pending={vote.pending}
            onToggle={() => void vote.toggle()}
            variant="compact"
          />
        </div>
      )}

      <LikesDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        users={users}
      />
    </>
  );
}
