import {
  isSessionRevokedCode,
  isTokenExpiredCode,
  readAuthErrorCode,
} from '@/graphql/apiError';
import { handleExpiredSession } from '@/lib/expiredSession';
import { isRefreshRejected, refreshAccessToken } from '@/lib/refreshSession';
import { getAuthToken } from '@/stores/authStore';

function withAuth(init?: RequestInit): RequestInit {
  const headers = new Headers(init?.headers);
  const token = getAuthToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  return {
    ...init,
    headers,
    credentials: 'include',
  };
}

/**
 * fetch with the access JWT, refreshing once when it has expired.
 * `init.body` must be reusable (FormData or a string). A stream cannot be sent twice.
 */
export async function authorizedFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const first = await fetch(input, withAuth(init));
  const firstCode = await readAuthErrorCode(first);

  if (isSessionRevokedCode(firstCode)) {
    handleExpiredSession();
    return first;
  }
  if (!isTokenExpiredCode(firstCode)) return first;

  try {
    await refreshAccessToken();
  } catch (error) {
    if (isRefreshRejected(error)) handleExpiredSession();
    return first;
  }

  const second = await fetch(input, withAuth(init));
  const secondCode = await readAuthErrorCode(second);
  if (isTokenExpiredCode(secondCode) || isSessionRevokedCode(secondCode)) {
    handleExpiredSession();
  }
  return second;
}
