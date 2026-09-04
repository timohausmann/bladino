import { TooltipProvider } from '@/components/ui/Tooltip';
import { queryClient } from '@/lib/queryClient';
import { getUserById } from '@/mocks/users';
import { useUserStore } from '@/stores/userStore';
import { QueryClientProvider } from '@tanstack/react-query';
import type { Decorator } from '@storybook/react-vite';
import { useEffect, type ReactNode } from 'react';
import { withRouter } from './withRouter';

interface PostShellProps {
  children: ReactNode;
}

function PostShell({ children }: PostShellProps) {
  useEffect(() => {
    const mockUser = getUserById('user-1');
    if (mockUser) {
      useUserStore.getState().setCurrentUser({
        id: mockUser.id,
        name: mockUser.name,
        avatar: mockUser.avatar ?? null,
        email: mockUser.email ?? null,
        description: mockUser.description ?? null,
        dateCreated: mockUser.dateCreated ?? null,
      });
    }

    return () => {
      useUserStore.getState().clearCurrentUser();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
    </QueryClientProvider>
  );
}

const withPostShell: Decorator = (Story, context) => (
  <PostShell key={context.id}>
    <Story />
  </PostShell>
);

const withPostCardFrame: Decorator = (Story) => (
  <div className="bg-background min-h-screen px-6 py-10">
    <div className="mx-auto w-full max-w-2xl pl-6">
      <Story />
    </div>
  </div>
);

/**
 * PostCard stories only. `withRouter` stays a sibling in the array so
 * Link-only stories can use it alone — this bundle does not wrap it.
 * Split query/user/tooltip into their own decorators when a second
 * consumer appears; until then they are PostCard's runtime, not primitives.
 *
 * Innermost first: Storybook applies the last decorator as the outermost wrap.
 */
export const withPostCard = [withRouter, withPostShell, withPostCardFrame];
