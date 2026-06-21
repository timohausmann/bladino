import { ClientError } from "graphql-request";

/** GraphQL response returned an errors array (graphql-request throws ClientError). */
export function isGraphQLClientError(error: unknown): error is ClientError {
  return error instanceof ClientError;
}

/** First GraphQL error message from a failed request, if available. */
export function getGraphQLErrorMessage(error: unknown): string | undefined {
  if (!isGraphQLClientError(error)) {
    return undefined;
  }

  const message = error.response.errors?.[0]?.message;
  return typeof message === "string" ? message : undefined;
}

/**
 * TanStack Query retry policy for GraphQL:
 * - Retry transient network failures.
 * - Do not retry GraphQL errors — the server responded; repeating won't help.
 */
export function isRetryableGraphQLError(error: unknown): boolean {
  if (isGraphQLClientError(error)) {
    return false;
  }

  // Fetch/network failures have no HTTP response body from GraphQL.
  return error instanceof TypeError || error instanceof Error;
}
