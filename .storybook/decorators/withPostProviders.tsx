import { TooltipProvider } from '@/components/ui/Tooltip';
import { queryClient } from '@/lib/queryClient';
import { getUserById } from '@/mocks/users';
import { useUserStore } from '@/stores/userStore';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import type { Decorator } from '@storybook/react-vite';
import { createContext, useContext, useEffect, type ReactNode } from 'react';

const StoryBridgeContext = createContext<() => ReactNode>(() => null);

function StoryBridge() {
  const renderStory = useContext(StoryBridgeContext);
  return renderStory();
}

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: StoryBridge,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/u/$name',
  component: () => (
    <p className="text-muted-foreground p-6 text-sm">
      Profile route placeholder
    </p>
  ),
});

const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/post/$id',
  component: () => (
    <p className="text-muted-foreground p-6 text-sm">Post route placeholder</p>
  ),
});

const storyRouter = createRouter({
  routeTree: rootRoute.addChildren([indexRoute, profileRoute, postRoute]),
  history: createMemoryHistory({ initialEntries: ['/'] }),
  context: { queryClient },
});

/**
 * Minimal app shell for post-related stories (router, query client, user, tooltips).
 */
interface PostProvidersProps {
  renderStory: () => ReactNode;
}

function PostProviders({ renderStory }: PostProvidersProps) {
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
      <TooltipProvider>
        <StoryBridgeContext.Provider value={renderStory}>
          <RouterProvider router={storyRouter} />
        </StoryBridgeContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export const withPostProviders: Decorator = (Story) => {
  const renderStory = () => <Story />;
  return <PostProviders renderStory={renderStory} />;
};

const postCardLayout: Decorator = (Story) => (
  <div className="bg-background min-h-screen px-6 py-10">
    <div className="mx-auto w-full max-w-2xl pl-6">
      <Story />
    </div>
  </div>
);

export const withPostCardLayout = [withPostProviders, postCardLayout];
