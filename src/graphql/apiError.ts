import { ClientError } from 'graphql-request';

/**
 * HTTP error body from Express auth middleware.
 *
 * Auth runs before the GraphQL handler, so rejected requests never produce a
 * GraphQL `errors` array — graphql-request surfaces them as ClientError with
 * status 401 and a JSON body instead.
 *
 * Keep in sync with the backend auth middleware.
 */
const AUTH_ERROR_CODE = {
  TOKEN_EXPIRED: 'token expired',
  UNAUTHORIZED: 'unauthorized',
} as const;

type AuthErrorCode = (typeof AUTH_ERROR_CODE)[keyof typeof AUTH_ERROR_CODE];

interface ApiErrorBody {
  error: string;
}

const AUTH_ERROR_CODES = new Set<string>(Object.values(AUTH_ERROR_CODE));

/** Whether a string matches a known auth middleware error code. */
function isAuthErrorCode(value: string): value is AuthErrorCode {
  return AUTH_ERROR_CODES.has(value);
}

/** Parses `{ error: string }` from a raw HTTP response body. */
function parseApiErrorBody(body: unknown): ApiErrorBody | undefined {
  if (typeof body === 'string') {
    try {
      return parseApiErrorBody(JSON.parse(body));
    } catch {
      return undefined;
    }
  }

  if (body && typeof body === 'object' && 'error' in body) {
    const { error } = body as ApiErrorBody;
    return typeof error === 'string' ? { error } : undefined;
  }

  return undefined;
}

/** Reads the raw body payload from a graphql-request ClientError. */
function getResponseBody(error: ClientError): unknown {
  return (error.response as { body?: unknown }).body;
}

/** Auth error code from a 401 response, if the body matches the middleware contract. */
function getAuthErrorCode(error: unknown): AuthErrorCode | undefined {
  if (!(error instanceof ClientError) || error.response.status !== 401) {
    return undefined;
  }

  const apiError = parseApiErrorBody(getResponseBody(error));
  if (!apiError || !isAuthErrorCode(apiError.error)) {
    return undefined;
  }

  return apiError.error;
}

/** Whether the API rejected the request because the auth token expired. */
export function isTokenExpiredError(error: unknown): boolean {
  return getAuthErrorCode(error) === AUTH_ERROR_CODE.TOKEN_EXPIRED;
}

/** Whether the auth middleware rejected the request for any other auth reason. */
export function isUnauthorizedError(error: unknown): boolean {
  return getAuthErrorCode(error) === AUTH_ERROR_CODE.UNAUTHORIZED;
}
