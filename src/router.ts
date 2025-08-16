import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import App from "./App";
import { ForgotPassword, Home, Login, PostDetail } from "./routes";

// Define the root route with App component
const rootRoute = createRootRoute({
  component: App,
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

// Create the route tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  postRoute,
  loginRoute,
  forgotPasswordRoute,
]);

// Create the router instance
export const router = createRouter({ routeTree });
