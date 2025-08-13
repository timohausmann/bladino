import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import App from "./App";
import { Home } from "./pages/Home";
import { PostDetail } from "./pages/PostDetail";

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

// Create the route tree
const routeTree = rootRoute.addChildren([homeRoute, postRoute]);

// Create the router instance
export const router = createRouter({ routeTree });
