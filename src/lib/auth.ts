import { isTokenExpiredError, isUnauthorizedError } from '@/graphql/apiError';
import { requestGraphQL } from '@/graphql/client';
import { CurrentUserDocument } from '@/graphql/generated/graphql';
import { queryClient } from '@/lib/queryClient';
import { clearAuthToken, getAuthToken } from '@/stores/authStore';
import { useUserStore, type CurrentUser } from '@/stores/userStore';

export const CURRENT_USER_QUERY_KEY = ['CurrentUser'] as const;

const SESSION_STALE_TIME_MS = 5 * 60 * 1000;

/** Resolves a post-login redirect target to a same-origin path. */
export function resolveRedirectTarget(redirect: unknown): string {
  if (typeof redirect !== 'string' || redirect.length === 0) {
    return '/';
  }

  try {
    const url = new URL(redirect, window.location.origin);
    if (url.origin !== window.location.origin) return '/';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return redirect.startsWith('/') ? redirect : '/';
  }
}

/** Clears the session and all cached API data that may belong to its user. */
export function clearSession(): void {
  clearAuthToken();
  useUserStore.getState().clearCurrentUser();
  queryClient.clear();
}

/**
 * Validates the auth token against the API and hydrates the user store.
 * Returns null when there is no valid session.
 */
export async function ensureSession(): Promise<CurrentUser | null> {
  if (!getAuthToken()) {
    useUserStore.getState().clearCurrentUser();
    return null;
  }

  try {
    const data = await queryClient.fetchQuery({
      queryKey: CURRENT_USER_QUERY_KEY,
      queryFn: () => requestGraphQL(CurrentUserDocument),
      staleTime: SESSION_STALE_TIME_MS,
    });

    const user = data.currentUser;
    if (!user) {
      clearSession();
      return null;
    }

    useUserStore.getState().setCurrentUser(user);
    return user;
  } catch (error) {
    // Keep the token unless the API rejected it.
    if (isTokenExpiredError(error) || isUnauthorizedError(error)) {
      clearSession();
    }
    return null;
  }
}
