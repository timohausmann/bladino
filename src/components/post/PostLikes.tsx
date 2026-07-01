import type { Comment } from '@/graphql';
import { useUserStore } from '@/stores/userStore';
import * as Dialog from '@radix-ui/react-dialog';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { PostVoteButton } from '@/components/post/PostVoteButton';

type LikeVote = NonNullable<Comment['votes']>[number];
type LikeUser = NonNullable<NonNullable<LikeVote>['user']>;

interface PostLikesProps {
  comment: Pick<Comment, 'id' | 'voteNum' | 'votes' | 'parent'>;
}

function getDisplayName(
  user: LikeUser,
  currentUserId: string | undefined,
): string {
  return user.id === currentUserId ? 'you' : user.name;
}

function getLikedByText(
  users: LikeUser[],
  currentUserId: string | undefined,
): string | null {
  if (users.length === 0) {
    return null;
  }

  if (users.length === 1) {
    return `Liked by ${getDisplayName(users[0], currentUserId)}`;
  }

  if (users.length === 2) {
    return `Liked by ${getDisplayName(users[0], currentUserId)} and ${getDisplayName(users[1], currentUserId)}`;
  }

  return `Liked by ${getDisplayName(users[0], currentUserId)} and ${users.length - 1} others`;
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
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm" />
        <Dialog.Content
          className={clsx(
            'fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md',
            '-translate-x-1/2 -translate-y-1/2 rounded-xl border border-neutral-200',
            'bg-white p-6 shadow-xl focus:outline-none dark:border-neutral-700 dark:bg-neutral-900',
          )}
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <Dialog.Title className="text-foreground text-lg font-semibold">
              Likes
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                aria-label="Close likes dialog"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          <ScrollArea className="max-h-80 pr-3" label="Likes list">
            <div className="flex flex-col gap-2">
              {users.map((user) => (
                <Link
                  key={user.id}
                  to="/u/$name"
                  params={{ name: user.name }}
                  className="hover:bg-muted flex items-center gap-3 rounded-xl px-1 py-2 transition-colors"
                >
                  <Avatar
                    avatar={user.avatar}
                    alt={`${user.name}'s avatar`}
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
export function PostLikes({ comment }: PostLikesProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const currentUser = useUserStore((store) => store.currentUser);
  const currentUserId = currentUser?.id;
  const users = useMemo(
    () => getUniqueVoteUsers(comment.votes, currentUserId),
    [comment.votes, currentUserId],
  );
  const likedByText = getLikedByText(users, currentUserId);

  return (
    <>
      <div className="flex min-w-0 items-center gap-2">
        <PostVoteButton comment={comment} />
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
      </div>

      <LikesDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        users={users}
      />
    </>
  );
}
