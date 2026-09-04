import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import type { Decorator } from '@storybook/react-vite';
import { createContext, useContext, useState, type ReactNode } from 'react';

const StoryBridgeContext = createContext<() => ReactNode>(() => null);

function StoryBridge() {
  const renderStory = useContext(StoryBridgeContext);
  return renderStory();
}

/**
 * Build a fresh tree per router. TanStack mutates the tree on init, so a
 * module-level tree would be shared (and corrupted) across stories.
 *
 * This is MemoryRouter, not a copy of the app: the real routes live in
 * `src/router.tsx` and only exist for TypeScript (`Register`). At runtime we
 * only need a provider plus a tree that accepts any URL without replacing the
 * story. Root renders the story and has no Outlet, so child routes never
 * paint. `/` is the starting location; `$` swallows every other path.
 */
const createStoryRouter = () => {
  const rootRoute = createRootRoute({
    component: StoryBridge,
  });

  return createRouter({
    routeTree: rootRoute.addChildren([
      createRoute({
        getParentRoute: () => rootRoute,
        path: '/',
      }),
      createRoute({
        getParentRoute: () => rootRoute,
        path: '$',
      }),
    ]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });
};

interface RouterHostProps {
  renderStory: () => ReactNode;
}

function RouterHost({ renderStory }: RouterHostProps) {
  const [router] = useState(() => createStoryRouter());

  return (
    <StoryBridgeContext.Provider value={renderStory}>
      <RouterProvider router={router} />
    </StoryBridgeContext.Provider>
  );
}

/**
 * Router context for component stories that use `Link` / `useNavigate`.
 */
export const withRouter: Decorator = (Story, context) => {
  const renderStory = () => <Story />;
  return <RouterHost key={context.id} renderStory={renderStory} />;
};
