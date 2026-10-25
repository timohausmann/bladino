import {
  discardStoredAccessToken,
  getAuthToken,
  setAuthToken,
} from '@/stores/authStore';

let refreshInFlight: Promise<void> | null = null;
let prepareInFlight: Promise<void> | null = null;

function authEndpoint(
  configured: string | undefined,
  fallback: string,
): string {
  const path = configured && configured.length > 0 ? configured : fallback;

  if (/^https?:\/\//.test(path)) return path;

  return new URL(path, window.location.origin).href;
}

/** The server rejected the refresh cookie. Callers log out. Other failures do not. */
export class RefreshRejectedError extends Error {
  constructor() {
    super('Auth refresh rejected');
    this.name = 'RefreshRejectedError';
  }
}

export function isRefreshRejected(error: unknown): boolean {
  return error instanceof RefreshRejectedError;
}

async function readToken(response: Response): Promise<string> {
  if (response.status === 401) throw new RefreshRejectedError();
  if (!response.ok) {
    throw new Error(`Auth refresh failed (${response.status})`);
  }
  const data = (await response.json()) as { token?: unknown };
  if (typeof data.token !== 'string' || data.token.length === 0) {
    throw new Error('Auth refresh response missing token');
  }
  return data.token;
}

function fetchAccessToken(): Promise<string> {
  return fetch(
    authEndpoint(import.meta.env.VITE_AUTH_REFRESH_URL, '/auth/refresh'),
    {
      method: 'POST',
      credentials: 'include',
    },
  ).then(readToken);
}

/**
 * One refresh for every caller that hits an expired access JWT together.
 * The cookie is rotated once; each caller then retries with the new JWT.
 * A lost response is retried once, while the server still accepts the old cookie.
 */
export function refreshAccessToken(): Promise<void> {
  if (!refreshInFlight) {
    refreshInFlight = fetchAccessToken()
      .catch((error: unknown) => {
        if (isRefreshRejected(error)) throw error;
        return fetchAccessToken();
      })
      .then((token) => {
        setAuthToken(token);
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

/**
 * Restores a session before the router decides the user is logged out.
 * A missing cookie is normal on the login page and must not flash "expired".
 */
export function prepareAccessToken(): Promise<void> {
  if (!prepareInFlight) {
    prepareInFlight = prepareOnce().finally(() => {
      prepareInFlight = null;
    });
  }
  return prepareInFlight;
}

async function prepareOnce(): Promise<void> {
  discardStoredAccessToken();
  if (getAuthToken()) return;

  try {
    await refreshAccessToken();
  } catch {
    // No cookie yet. Stay logged out without treating it as an expiry.
  }
}

/** Ends the server session. The caller still clears the in-memory token. */
export async function logoutServerSession(): Promise<void> {
  const response = await fetch(
    authEndpoint(import.meta.env.VITE_AUTH_LOGOUT_URL, '/auth/logout'),
    {
      method: 'POST',
      credentials: 'include',
    },
  );
  if (!response.ok) {
    throw new Error(`Logout failed (${response.status})`);
  }
}
