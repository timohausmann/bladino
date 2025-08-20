import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import App from "./App";
import {
  ForgotPassword,
  Home,
  Login,
  Logout,
  NotFound,
  PostDetail,
  Profile,
  Settings,
} from "./routes";

// Define the root route with App component
const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: NotFound,
});

// Define the home route
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

// Define the post detail route
const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/post/$id",
  component: PostDetail,
});

// Define the login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

// Define the forgot password route
const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: ForgotPassword,
});

// Define the profile route
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/u/$handle",
  component: Profile,
});

// Define the logout route
const logoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/logout",
  component: Logout,
});

// Define the settings route
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: Settings,
});

// Create the route tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  postRoute,
  loginRoute,
  forgotPasswordRoute,
  profileRoute,
  logoutRoute,
  settingsRoute,
]);

// Create the router instance
export const router = createRouter({
  routeTree,
  defaultViewTransition: true,
});
