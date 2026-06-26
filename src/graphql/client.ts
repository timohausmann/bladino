import { getAuthToken } from '@/stores/authStore';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { GraphQLClient } from 'graphql-request';

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

export function requestGraphQL<TResult, TVariables extends object>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
): Promise<TResult> {
  return graphqlClient.request<TResult>(document, variables, authHeaders());
}
