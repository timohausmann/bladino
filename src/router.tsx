import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import App from './App';
import { ensureSession, resolveRedirectTarget } from './lib/auth';
import { queryClient } from './lib/queryClient';
import {
  ForgotPassword,
  Home,
  Login,
  Logout,
  Notes,
  NotFound,
  PostDetail,
  Profile,
  Settings,
} from './routes';
import { ButtonLab } from './routes/ButtonLab';

export interface RouterContext {
  queryClient: QueryClient;
}

type LoginSearch = {
  returnTo?: string;
};

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: App,
  notFoundComponent: NotFound,
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_authenticated',
  beforeLoad: async ({ context, location }) => {
    const user = await ensureSession(context.queryClient);
    if (!user) {
      throw redirect({
        to: '/login',
        search: { returnTo: location.pathname + location.searchStr },
      });
    }
    return { user };
  },
  component: () => <Outlet />,
});

const homeRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/',
  component: Home,
});

const postRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/post/$id',
  component: PostDetail,
});

const profileRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/u/$name',
  component: Profile,
});

const settingsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/settings',
  component: Settings,
});

const notesIndexRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/notes',
  component: Notes,
  staticData: { fixedViewport: true, layoutMode: 'masterDetail' },
});

const notesDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/notes/$id',
  component: Notes,
  staticData: { fixedViewport: true, layoutMode: 'masterDetail' },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : undefined,
  }),
  beforeLoad: async ({ context, search }) => {
    const user = await ensureSession(context.queryClient);
    if (user) {
      throw redirect({
        to: resolveRedirectTarget(search.returnTo),
        replace: true,
      });
    }
  },
  component: Login,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPassword,
});

const logoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/logout',
  component: Logout,
});

const buttonLabRoute = import.meta.env.DEV
  ? createRoute({
      getParentRoute: () => rootRoute,
      path: '/lab/button',
      component: ButtonLab,
    })
  : null;

const publicRoutes = [
  loginRoute,
  forgotPasswordRoute,
  logoutRoute,
  ...(buttonLabRoute ? [buttonLabRoute] : []),
];

const routeTree = rootRoute.addChildren([
  authenticatedRoute.addChildren([
    homeRoute,
    postRoute,
    profileRoute,
    settingsRoute,
    notesIndexRoute,
    notesDetailRoute,
  ]),
  ...publicRoutes,
]);

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultViewTransition: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }

  interface StaticDataRouteOption {
    fixedViewport?: boolean;
    layoutMode?: 'feed' | 'masterDetail' | 'fullWidth';
  }
}
