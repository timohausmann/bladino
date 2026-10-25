import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { GraphQLClient } from 'graphql-request';
import { handleExpiredSession, notifyUnauthorized } from '@/lib/expiredSession';
import { isRefreshRejected, refreshAccessToken } from '@/lib/refreshSession';
import { getAuthToken } from '@/stores/authStore';
import {
  isSessionRevokedError,
  isTokenExpiredError,
  isUnauthorizedError,
} from './apiError';

function resolveGraphQLEndpoint(): string {
  const configured = import.meta.env.VITE_GRAPHQL_URL ?? '/graphql';

  // graphql-request v7 uses `new URL(url)` internally — relative paths throw without a base.
  if (/^https?:\/\//.test(configured)) {
    return configured;
  }

  return new URL(configured, window.location.origin).href;
}

const endpoint = resolveGraphQLEndpoint();

export const graphqlClient = new GraphQLClient(endpoint, {
  credentials: 'include',
});

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function rejectAuth(error: unknown): void {
  if (isTokenExpiredError(error) || isSessionRevokedError(error)) {
    handleExpiredSession();
    return;
  }
  if (isUnauthorizedError(error)) {
    notifyUnauthorized();
  }
}

async function executeGraphQL<TResult, TVariables extends object>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
): Promise<TResult> {
  return graphqlClient.request<TResult>(document, variables, authHeaders());
}

export async function requestGraphQL<TResult, TVariables extends object>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
): Promise<TResult> {
  try {
    return await executeGraphQL(document, variables);
  } catch (error) {
    // One silent refresh, then the same operation. A second expiry logs out.
    if (!isTokenExpiredError(error)) {
      rejectAuth(error);
      throw error;
    }

    try {
      await refreshAccessToken();
    } catch (refreshError) {
      // A dropped connection still has a cookie. Only a rejected refresh logs out.
      if (isRefreshRejected(refreshError)) handleExpiredSession();
      throw refreshError;
    }

    try {
      return await executeGraphQL(document, variables);
    } catch (retryError) {
      rejectAuth(retryError);
      throw retryError;
    }
  }
}
