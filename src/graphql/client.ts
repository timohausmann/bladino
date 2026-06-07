import { getAuthToken } from "@/stores/authStore";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { GraphQLClient } from "graphql-request";

const endpoint = import.meta.env.VITE_GRAPHQL_URL ?? "/graphql";

export const graphqlClient = new GraphQLClient(endpoint, {
  credentials: "include",
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
