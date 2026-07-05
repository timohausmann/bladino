import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import App from './App';
import { ensureSession, resolveRedirectTarget } from './lib/auth';
import { queryClient } from './lib/queryClient';

export interface RouterContext {
  queryClient: QueryClient;
}

type LoginSearch = {
  returnTo?: string;
};

type MailsSearch = {
  folder?: 'inbox' | 'outbox';
  compose?: boolean;
};

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: App,
  notFoundComponent: lazyRouteComponent(
    () => import('./routes/NotFound'),
    'NotFound',
  ),
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_authenticated',
  beforeLoad: async ({ location }) => {
    const user = await ensureSession();
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

const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/',
  component: lazyRouteComponent(
    () => import('./routes/Dashboard'),
    'Dashboard',
  ),
  staticData: { fixedViewport: true, layoutMode: 'fullWidth' },
});

const feedRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/feed',
  component: lazyRouteComponent(() => import('./routes/Home'), 'Home'),
  staticData: { layoutMode: 'feed' },
});

const notificationsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/notifications',
  component: lazyRouteComponent(
    () => import('./routes/Notifications'),
    'Notifications',
  ),
});

const dashboardRedirectRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/dashboard',
  beforeLoad: () => {
    throw redirect({ to: '/' });
  },
});

const postRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/post/$id',
  component: lazyRouteComponent(
    () => import('./routes/PostDetail'),
    'PostDetail',
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/u/$name',
  component: lazyRouteComponent(() => import('./routes/Profile'), 'Profile'),
});

const settingsLayoutRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/settings',
  component: lazyRouteComponent(
    () => import('./routes/settings/SettingsLayout'),
    'SettingsLayout',
  ),
  staticData: { fixedViewport: true, layoutMode: 'fullWidth' },
});

const settingsIndexRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/settings/appearance' });
  },
});

const settingsAppearanceRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: '/appearance',
  component: lazyRouteComponent(
    () => import('./routes/settings/SettingsAppearance'),
    'SettingsAppearance',
  ),
});

const settingsLanguageRedirectRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: '/language',
  beforeLoad: () => {
    throw redirect({ to: '/settings/appearance' });
  },
});

const settingsThemeRedirectRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: '/theme',
  beforeLoad: () => {
    throw redirect({ to: '/settings/appearance' });
  },
});

const settingsPasswordRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: '/password',
  component: lazyRouteComponent(
    () => import('./routes/settings/SettingsPassword'),
    'SettingsPassword',
  ),
});

const channelsIndexRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/channels',
  component: lazyRouteComponent(() => import('./routes/Channels'), 'Channels'),
});

const channelsDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/channels/$id',
  component: lazyRouteComponent(() => import('./routes/Channels'), 'Channels'),
});

const notesIndexRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/notes',
  component: lazyRouteComponent(() => import('./routes/Notes'), 'Notes'),
  staticData: { fixedViewport: true, layoutMode: 'masterDetail' },
});

const notesDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/notes/$id',
  component: lazyRouteComponent(() => import('./routes/Notes'), 'Notes'),
  staticData: { fixedViewport: true, layoutMode: 'masterDetail' },
});

const mailsIndexRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/mails',
  validateSearch: (search: Record<string, unknown>): MailsSearch => ({
    folder:
      search.folder === 'outbox' || search.folder === 'inbox'
        ? search.folder
        : undefined,
    compose:
      search.compose === true || search.compose === 'true' ? true : undefined,
  }),
  component: lazyRouteComponent(() => import('./routes/Mails'), 'Mails'),
  staticData: { fixedViewport: true, layoutMode: 'masterDetail' },
});

const mailsDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/mails/$id',
  validateSearch: (search: Record<string, unknown>): MailsSearch => ({
    folder:
      search.folder === 'outbox' || search.folder === 'inbox'
        ? search.folder
        : undefined,
    compose:
      search.compose === true || search.compose === 'true' ? true : undefined,
  }),
  component: lazyRouteComponent(() => import('./routes/Mails'), 'Mails'),
  staticData: { fixedViewport: true, layoutMode: 'masterDetail' },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : undefined,
  }),
  beforeLoad: async ({ search }) => {
    const user = await ensureSession();
    if (user) {
      throw redirect({
        to: resolveRedirectTarget(search.returnTo),
        replace: true,
      });
    }
  },
  component: lazyRouteComponent(() => import('./routes/Login'), 'Login'),
});

const checkinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkin/$token',
  beforeLoad: async () => {
    const user = await ensureSession();
    if (user) {
      throw redirect({ to: '/', replace: true });
    }
  },
  component: lazyRouteComponent(() => import('./routes/Checkin'), 'Checkin'),
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: lazyRouteComponent(
    () => import('./routes/ForgotPassword'),
    'ForgotPassword',
  ),
});

const logoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/logout',
  component: lazyRouteComponent(() => import('./routes/Logout'), 'Logout'),
});

const publicRoutes = [
  loginRoute,
  checkinRoute,
  forgotPasswordRoute,
  logoutRoute,
];

const routeTree = rootRoute.addChildren([
  authenticatedRoute.addChildren([
    dashboardRoute,
    feedRoute,
    notificationsRoute,
    dashboardRedirectRoute,
    postRoute,
    profileRoute,
    settingsLayoutRoute.addChildren([
      settingsIndexRoute,
      settingsAppearanceRoute,
      settingsLanguageRedirectRoute,
      settingsThemeRedirectRoute,
      settingsPasswordRoute,
    ]),
    channelsIndexRoute,
    channelsDetailRoute,
    notesIndexRoute,
    notesDetailRoute,
    mailsIndexRoute,
    mailsDetailRoute,
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
